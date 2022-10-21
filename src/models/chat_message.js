"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class chat_message extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ chat_room }) {
      // define association here
      this.belongsTo(chat_room, { foreignKey: "room_id" });
    }
  }
  chat_message.init(
    {
      message_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      room_id: DataTypes.STRING,
      sender_id: DataTypes.INTEGER,
      message: DataTypes.STRING,
      message_status: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "chat_message",
    }
  );
  return chat_message;
};
