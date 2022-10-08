const moment = require("moment");
const assesment_question = require("../../models").assesment_question;
const assesment_question_answer =
  require("../../models").assesment_question_answer;
const assesment_attempt = require("../../models").assesment_attempt;

exports.make_assessment = async (req, res) => {
  const MIN_SCORE = 20;
  let response = {
    status: "Failed",
    message: "",
    data: [],
  };

  try {
    const check_attempt = await assesment_attempt.findOne({
      where: {
        user_id: req.user_id,
      },
      order: [["createdAt", "DESC"]],
    });

    if (
      check_attempt &&
      moment() <= moment(check_attempt.createdAt).add(4, "h")
    ) {
      response.message =
        "Wait for a while before take another assessment test!";
      return res.send(response);
    }
  } catch (error) {
    response.message = error.message;
    res.send(response);
  }

  let score = 0;
  const answers = req.body;
  for (const answer of answers) {
    try {
      const check = await assesment_question_answer.findOne({
        where: {
          question_id: answer.question_id,
          answer_id: answer.answer_id,
        },
      });

      if (check && check.is_correct) {
        score += 2;
      }
    } catch (error) {
      response.message = error.message;
      res.send(response);
    }
  }

  let attempt_data = {
    user_id: req.user_id,
    score: score,
    status: score >= MIN_SCORE ? true : false,
  };

  try {
    const create_attempt = await assesment_attempt.create(attempt_data);
    if (create_attempt) {
      response.status = "success";
      response.message = "Attempt created!";
      response.data = {
        status: score >= MIN_SCORE ? "success" : "fail",
        score: score,
        total_score: answers.length * 2,
      };
    }
    res.send(response);
  } catch (error) {
    response.message = error.message;
    res.send(response);
  }
};
