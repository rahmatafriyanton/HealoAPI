const {
  get_assessment_questions,
  create_assessment_questions,
} = require("./question");

const { make_assessment } = require("./assessment");

const assesment = {
  get_assessment_questions,
  create_assessment_questions,

  make_assessment,
};
module.exports = assesment;
