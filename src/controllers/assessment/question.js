const assesment_question = require("../../models").assesment_question;
const assesment_question_answer =
  require("../../models").assesment_question_answer;

exports.get_assessment_questions = async (req, res) => {
  let response = {
    status: "Failed",
    message: "",
    data: [],
  };

  try {
    const questions = await assesment_question.findAll({
      include: {
        model: assesment_question_answer,
        as: "answers",
        attributes: ["answer_id", "answer"],
      },
      order: [["question_number", "ASC"]],
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });

    if (questions) {
      response.status = "success";
      response.message = "Questions Data Retrieved";
      response.data = questions;
    }
  } catch (error) {
    response.message = error.message;
  }

  res.send(response);
};

exports.create_assessment_questions = async (req, res) => {
  let response = {
    status: "Failed",
    message: "",
    data: [],
  };

  const questions = req.body;

  for (const question of questions) {
    try {
      const assessment = await assesment_question.create({
        ...question,
        question_id: question.question_number,
      });
      for (const answer of question.answers) {
        try {
          await assesment_question_answer.create({
            ...answer,
            question_id: assessment.question_id,
          });
        } catch (error) {
          console.log(error.message);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  }
  response.status = "success";
  response.message = "Question Created";
  res.send(response);
};
