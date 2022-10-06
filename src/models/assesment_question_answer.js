"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class assesment_question_answer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ assesment_question }) {
      // define association here
      this.belongsTo(assesment_question, { foreignKey: "question_id" });
    }
  }
  assesment_question_answer.init(
    {
      answer_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      question_id: DataTypes.INTEGER,
      answer: DataTypes.STRING,
      is_correct: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "assesment_question_answer",
    }
  );
  return assesment_question_answer;
};
