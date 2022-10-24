const Op = require('Sequelize').Op;
const chat_room = require("../models").chat_room;
const chat_message = require("../models").chat_message
const {findUserByUserID} = require("./user.service")

const TimeAgo = require("javascript-time-ago")
const id = require('javascript-time-ago/locale/id')

TimeAgo.addDefaultLocale(id)
const getFormattedDate = new TimeAgo('id-ID')
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
      let chat = chats[i]
      chat.seeker = set_user_respond( await findUserByUserID(chat.seeker_id, true))
      chat.healer = set_user_respond(await findUserByUserID(chat.healer_id, true))
      chat.last_message = await getLastMessage(chat.room_id)
      chat.number_of_unread = await count_unread_message(req.user_id, chat.room_id)
      
      delete chat.seeker_id;
      delete chat.healer_id;
      
      return chat
    }
    
  }
  return chats
};

async function getLastMessage (room_id) {
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
          status = "sent"
          break
        case 1:
          status = "read"
          break
        case 3:
          status = "deleted"
          break
      }
      return {
        ...message,
        status: status,
        createdAt: getFormattedDate.format(new Date(message.createdAt), 'mini'),
        updatedAt: getFormattedDate.format(new Date(message.createdAt), 'mini')
      }
    }
  } catch (error) {
    return error.message
  }

  return {}
}

function set_user_respond(user) {
  return {
    user_id: user.user_id,
    user_name: user.user_name,
    user_email: user.user_email,
    user_gender: user.user_gender === "M" ? "Laki-Laki" : "Perempuan",
    age: new Date().getFullYear() - user.user_year_born,
    profile_pict: user.user_profile_pict
  }
}


async function count_unread_message(user_id, room_id) {
  let message_count = 0
  try {
    message_count = await chat_message.count({
      raw: true,
      where: {
        room_id: room_id,
        sender_id: !user_id,
        message_status: 2
      },
      order: [["createdAt", "DESC"]],
    });

    
  } catch (error) {
    return error.message
  }

  return message_count
}


// username
// profile_icon
// umur
// gender 

