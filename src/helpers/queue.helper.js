const User = require("../models").User;

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

exports.confirm_pairing = (io, pair_confirm) => {
  const index = pairing_waiting.findIndex((item) => {
    return item.id === pair_confirm.id;
  });

  const { status } = pair_confirm;
  if (status === "accept") {
    console.log("accept");
  } else {
    console.log("denied");
  }
  return null;
};

function accept_pairing(index) {}

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
