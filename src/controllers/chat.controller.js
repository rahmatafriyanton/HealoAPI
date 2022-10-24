const { getChatList } = require("../service/chat.service");

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
  // req.io.to(req.user_id.toString()).emit("got_paired", "It works!");
  queue.add_healer_available(req.user_id);
  res.send(queue.get_healer_available());
};

exports.pair_the_user = (io) => {
  const pair = queue.pair_the_user();
  io.to(pair.healer_id).emit("got_paired", pair);
  console.log("Pair Req: ", queue.get_pairing_req());
  console.log("Healer Avail: ", queue.get_healer_available());
  console.log("Pair Waiting: ", queue.get_pairing_waiting());
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

// End Chat