"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("chat_rooms", {
      room_id: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true,
      },
      seeker_id: {
        type: Sequelize.INTEGER,
      },
      healer_id: {
        type: Sequelize.INTEGER,
      },
      preflection: {
        type: Sequelize.STRING,
      },
      preflection_time: {
        type: Sequelize.DATE,
      },
      postflection: {
        type: Sequelize.TEXT,
      },
      postflection_time: {
        type: Sequelize.DATE,
      },
      room_status: {
        type: Sequelize.STRING,
      },
      room_closed_by: {
        type: Sequelize.INTEGER,
      },
      room_closed_reason: {
        type: Sequelize.STRING,
      },
      seeker_mood_checkout: {
        type: Sequelize.FLOAT,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("chat_rooms");
  },
};
