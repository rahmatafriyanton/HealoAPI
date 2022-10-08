"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ assesment_attempt }) {
      // define association here
      this.hasMany(assesment_attempt, {
        as: "assesment_attempt",
        foreignKey: "user_id",
      });
    }
  }
  user.init(
    {
      user_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      role_id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
      },
      user_name: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      user_email: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      user_is_available: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 1,
      },
      user_gender: {
        type: DataTypes.STRING(2),
      },
      user_year_born: {
        type: DataTypes.INTEGER,
      },
      user_goal: {
        type: DataTypes.STRING(50),
      },
      user_avail_hour: {
        type: DataTypes.STRING(50),
      },
      user_desc: {
        type: DataTypes.STRING(50),
      },
      user_profile_pict: {
        type: DataTypes.STRING(50),
      },
      is_accept_agreement: {
        type: DataTypes.BOOLEAN,
      },
      agreement_time: {
        type: DataTypes.DATE,
      },
      is_email_validated: {
        type: DataTypes.BOOLEAN,
        defaultValue: 0,
      },
      email_validation_key: {
        type: DataTypes.INTEGER(5),
      },
      email_validation_valid_until: {
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "users",
    }
  );
  return user;
};
