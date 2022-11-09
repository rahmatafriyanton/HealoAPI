const Op = require("sequelize").Op;
const chat_room = require("../models").chat_room;
const chat_message = require("../models").chat_message;
const { findUserByUserID } = require("./user.service");
const { v4: uuidv4 } = require("uuid");
const moment = require("moment");

const TimeAgo = require("javascript-time-ago");
const id = require("javascript-time-ago/locale/id");

TimeAgo.addDefaultLocale(id);
const getFormattedDate = new TimeAgo("id-ID");
exports.createChatRoom = async (room) => {
  return await chat_room.create(room);
};

exports.getChatList = async (req) => {
  let chats = await chat_room.findAll({
    raw: true,
    order: [["createdAt", "ASC"]],
    where: {
      [Op.or]: [{ seeker_id: req.user_id }, { healer_id: req.user_id }],
    },
  });

  if (chats && chats.length > 0) {
    for (let i = 0; i < chats.length; i++) {
      let chat = chats[i];
      chat.seeker = set_user_respond(
        await findUserByUserID(chat.seeker_id, true)
      );
      chat.healer = set_user_respond(
        await findUserByUserID(chat.healer_id, true)
      );
      chat.last_message = await getLastMessage(chat.room_id);
      chat.number_of_unread = await count_unread_message(
        req.user_id,
        chat.room_id
      );

      delete chat.seeker_id;
      delete chat.healer_id;

      chats[i] = chat;
    }
  }
  return chats;
};

exports.getChatDetail = async (req) => {
  let chat = await chat_room.findOne({
    raw: true,
    order: [["createdAt", "ASC"]],
    where: { room_id: req.params.room_id },
  });

  if (chat) {
    chat.seeker = set_user_respond(
      await findUserByUserID(chat.seeker_id, true)
    );
    chat.healer = set_user_respond(
      await findUserByUserID(chat.healer_id, true)
    );
    chat.messages = await getAllMessage(chat.room_id);
    chat.number_of_unread = await count_unread_message(
      req.user_id,
      chat.room_id
    );

    delete chat.seeker_id;
    delete chat.healer_id;

    return chat;
  }
  return chat;
};

exports.sentMessage = async (req) => {
  const data = {
    message_id: uuidv4(),
    sender_id: req.user_id,
    ...req.body,
  };

  try {
    if (await chat_message.create(data)) return data;
  } catch (error) {
    return error;
  }
};

exports.endChat = async (req) => {
  try {
    const payload = {
      ...req.body,
      room_status: "closed",
      room_closed_by: req.user_id,
    };
    let close_room = await chat_room.update(payload, {
      where: { room_id: req.body.room_id },
    });

    if (close_room) {
      return payload;
    }
  } catch (error) {
    console.log("error: ", error.message);
  }
};

exports.getUserActiveRoom = async (user_id, socket) => {
  try {
    let room = await chat_room.findOne({
      raw: true,
      where: {
        room_status: "active",
        [Op.or]: [
          {
            seeker_id: user_id,
          },
          {
            healer_id: user_id,
          },
        ],
      },
    });

    if (room !== null) {
      socket.join(room.room_id);
    }
  } catch (error) {
    console.log("error: ", error.message);
  }
};

async function count_unread_message(user_id, room_id) {
  let message_count = 0;
  try {
    message_count = await chat_message.count({
      raw: true,
      where: {
        room_id: room_id,
        sender_id: !user_id,
        message_status: 2,
      },
      order: [["createdAt", "DESC"]],
    });
  } catch (error) {
    return error.message;
  }

  return message_count;
}

async function getLastMessage(room_id) {
  try {
    const message = await chat_message.findOne({
      raw: true,
      where: {
        room_id: room_id,
      },
      order: [["createdAt", "DESC"]],
    });

    if (message) {
      switch (message.message_status) {
        case 2:
          status = "sent";
          break;
        case 1:
          status = "read";
          break;
        case 3:
          status = "deleted";
          break;
      }
      return {
        ...message,
        status: status,
        createdAt: moment(new Date(message.createdAt)).format(
          "DD-MM-yyyy HH:mm"
        ),
        updatedAt: moment(new Date(message.updatedAt)).format(
          "DD-MM-yyyy HH:mm"
        ),
      };
    }
  } catch (error) {
    return error.message;
  }

  return null;
}

async function getAllMessage(room_id) {
  try {
    let messages = await chat_message.findAll({
      raw: true,
      where: {
        room_id: room_id,
      },
      order: [["createdAt", "DESC"]],
    });

    if (messages && messages.length > 0) {
      messages = messages.map((message) => {
        switch (message.message_status) {
          case 2:
            status = "sent";
            break;
          case 1:
            status = "read";
            break;
          case 3:
            status = "deleted";
            break;
        }
        return {
          ...message,
          status: status,
          createdAt: moment(new Date(message.createdAt)).format(
            "DD-MM-yyyy HH:mm"
          ),
          updatedAt: moment(new Date(message.updatedAt)).format(
            "DD-MM-yyyy HH:mm"
          ),
        };
      });
      return messages;
    }
  } catch (error) {
    return error.message;
  }

  return null;
}

function set_user_respond(user) {
  return {
    user_id: user.user_id,
    user_name: user.user_name,
    user_email: user.user_email,
    user_gender: user.user_gender === "M" ? "Laki-Laki" : "Perempuan",
    age: new Date().getFullYear() - user.user_year_born,
    profile_pict: user.user_profile_pict,
  };
}

// username
// profile_icon
// umur
// gender
