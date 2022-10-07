"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("users", {
      user_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      role_id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
      },
      user_name: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      user_email: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      user_is_available: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: 1,
      },
      user_gender: {
        type: Sequelize.STRING(2),
      },
      user_year_born: {
        type: Sequelize.INTEGER,
      },
      user_goal: {
        type: Sequelize.STRING(50),
      },
      user_avail_hour: {
        type: Sequelize.STRING(50),
      },
      user_desc: {
        type: Sequelize.STRING(50),
      },
      user_profile_pict: {
        type: Sequelize.STRING(50),
      },
      is_accept_agreement: {
        type: Sequelize.BOOLEAN,
      },
      agreement_time: {
        type: Sequelize.DATE,
      },
      is_email_validated: {
        type: Sequelize.BOOLEAN,
        defaultValue: 0,
      },
      email_validation_key: {
        type: Sequelize.INTEGER(5),
      },
      email_validation_valid_until: {
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("users");
  },
};
