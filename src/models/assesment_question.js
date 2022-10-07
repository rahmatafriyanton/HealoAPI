"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class assesment_question extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ assesment_question_answer }) {
      // define association here
      this.hasMany(assesment_question_answer, {
        as: "answers",
        foreignKey: "question_id",
      });
    }
  }
  assesment_question.init(
    {
      question_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      question_number: DataTypes.INTEGER,
      title: DataTypes.STRING,
      description: DataTypes.STRING,
      question: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "assesment_question",
    }
  );
  return assesment_question;
};
