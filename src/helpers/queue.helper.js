const { createChatRoom } = require("../service/chat.service");
const { v4: uuidv4 } = require("uuid");

let pairing_req = [];
let pairing_waiting = [];
let healer_available = [];

exports.get_pairing_req = () => pairing_req;
exports.get_pairing_waiting = () => pairing_waiting;
exports.get_healer_available = () => healer_available;

exports.add_pairing_req = (data) => {
  const found = pairing_req.some((el) => el.seeker_id === data.seeker_id);
  if (!found) pairing_req.push(data);
  return pairing_req;
};

exports.add_healer_available = (user_id) => {
  const found = healer_available.some((el) => el === user_id);
  if (!found) healer_available.push(user_id);
  return healer_available;
};

exports.pair_the_user = () => {
  if (pairing_req.length >= 1) {
    if (healer_available.length >= 1) {
      const random_index = Math.floor(Math.random() * healer_available.length);
      const healer_id = healer_available[random_index];
      healer_available.splice(random_index, 1);
      let req = pairing_req.shift();
      req.healer_id = healer_id;
      req.status = "waiting";
      pairing_waiting.push(req);
      return req;
    }
  }
  return null;
};

exports.confirm_pairing = (io, users_connected, pair_confirm) => {
  const index = pairing_waiting.findIndex((item) => {
    return item.id === pair_confirm.id;
  });

  const { status } = pair_confirm;
  const data = pairing_waiting.splice(index, 1)[0];

  if (status === "accept") {
    const new_room = {
      room_id: uuidv4(),
      seeker_id: data.seeker_id,
      healer_id: data.healer_id,
      room_status: "active",
      preflection: data.preflection,
    };

    accept_pairing(new_room);
    users_connected.map((user) => {
      if (user.user_id === data.seeker_id) {
        user.socket.join(new_room.room_id);
      }

      if (user.user_id === data.healer_id) {
        user.socket.join(new_room.room_id);
      }
      return;
    });


    io.emit("chat_session_created", new_room);
  } else {
    data.status = "queue";
    healer_available.push(data.healer_id);
    data.healer_id = "";
    pairing_req.push(data);
    console.log(pairing_req);
  }
  return null;
};

async function accept_pairing(data) {
  try {
    await createChatRoom(data);
  } catch (error) {
    console.log("Error: ", error.message);
  }
}

function filter_healer(req) {
  const healers = healer_available.map(async (healer_id) => {
    try {
      const healer = await findUserByUserID(healer_id);
      if (healer) {
        const { data } = req;
        if (healer.user_gender === data.prefered_gender) {
          return healer;
        }
      }
    } catch (error) {
      console.log("error: ", error.message);
    }
  });

  return healers[Math.floor(Math.random() * healer_available.length)];
}
