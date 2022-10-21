"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class chat_room extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ chat_message }) {
      // define association here
      this.hasMany(chat_message, {
        as: "messages",
        foreignKey: "room_id",
      });
    }
  }
  chat_room.init(
    {
      room_id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.STRING,
      },
      seeker_id: DataTypes.INTEGER,
      healer_id: DataTypes.INTEGER,
      preflection: DataTypes.STRING,
      preflection_time: DataTypes.DATE,
      postflection: DataTypes.TEXT,
      postflection_time: DataTypes.DATE,
      room_status: DataTypes.STRING,
      room_closed_by: DataTypes.INTEGER,
      room_closed_reason: DataTypes.STRING,
      seeker_mood_checkout: DataTypes.FLOAT,
    },
    {
      sequelize,
      modelName: "chat_room",
    }
  );
  return chat_room;
};
