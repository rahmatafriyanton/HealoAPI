const chat_room = require("../models").chat_room;

exports.createChatRoom = async (room) => {
  return await chat_room.create(room);
};
