const config = require("../config/auth.config");
const assesment_question = require("../models").assesment_question;
exports.get_assessment_questions = async (req, res) => {
  res.send({ status: "success" });
};

exports.create_assessment_questions = async (req, res) => {
  let response = {
    status: "Failed",
    message: "",
    data: [],
  };

  const questions = req.body;

  try {
    await assesment_question.bulkCreate(questions);
  } catch (error) {
    console.log(error.message);
  }

  res.send("Bisa");
};
