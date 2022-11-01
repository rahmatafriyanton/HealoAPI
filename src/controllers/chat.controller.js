const {
  getChatList,
  getChatDetail,
  sentMessage,
  checkUserActiveRoom,
  getUserActiveRoom,
  endChat,
} = require("../service/chat.service");

const { v4: uuidv4 } = require("uuid");
const queue = require("../helpers/queue.helper.js");

exports.find_healer = async (req, res) => {
  let response = {
    status: "success",
    message: "Request added to queue!",
    data: [],
  };

  const payload = {
    id: uuidv4(),
    seeker_id: req.user_id,
    healer_id: "",
    status: "queue",
    ...req.body,
  };

  queue.add_pairing_req(payload);
  res.send(response);
};

exports.add_healer_available = (req, res) => {
  queue.add_healer_available(req.user_id);
  res.send({
    status: "success",
    message: "Healer added to queue!",
    data: [],
  });
};

exports.pair_the_user = (io) => {
  const pair = queue.pair_the_user();
  io.to(pair.healer_id).emit("got_paired", pair);
};

// Chat
exports.get_chat_list = async (req, res) => {
  let response = {
    status: "failed",
    message: "",
    data: [],
  };
  try {
    const chats = await getChatList(req);
    response.status = "success";
    response.message = "Chats data retrieved";
    response.data = chats;

    res.send(response);
  } catch (error) {
    response.message = error.message;
    res.send(response);
  }
};

exports.get_chat_detail = async (req, res) => {
  let response = {
    status: "failed",
    message: "",
    data: [],
  };
  try {
    const chats = await getChatDetail(req);
    response.status = "success";
    response.message = "Chat data retrieved";
    response.data = chats;

    res.send(response);
  } catch (error) {
    response.message = error.message;
    res.send(response);
  }
};

exports.sent_message = async (req, res) => {
  let response = {
    status: "failed",
    message: "",
    data: [],
  };
  try {
    const message = await sentMessage(req);
    response.status = "success";
    response.message = "Message sended!";
    response.data = message;

    req.users_connected.map((user) => {
      if (user.user_id === message.sender_id) {
        user.socket.broadcast.to(message.room_id).emit("new_message", message);
      }
    });

    res.send(response);
  } catch (error) {
    response.message = error.message;
    res.send(response);
  }
};

exports.end_chat = async (req, res) => {
  let response = {
    status: "failed",
    message: "",
    data: [],
  };
  try {
    const room_ended = await endChat(req);
    response.status = "success";
    response.message = "Chat room closed!";
    response.data = [];

    req.io.in(req.body.room_id).emit("room_ended", room_ended);

    res.send(response);
  } catch (error) {
    response.message = error.message;
    res.send(response);
  }
};

exports.check_user_room = async (user_id, socket) => {
  try {
    getUserActiveRoom(user_id, socket);
  } catch (error) {
    console.log("Error: ", error.message);
  }
};

// End Chat
