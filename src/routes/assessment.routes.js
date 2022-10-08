const express = require("express");
const router = express.Router();
const { authJwt } = require("../middleware");
const controller = require("../controllers/assessment/");

const { verify_token, is_email_valid, is_healer, verifyAccess } = authJwt;

// Question
router.get(
  "/question",
  [verify_token, is_email_valid],
  controller.get_assessment_questions
);
router.post("/question", controller.create_assessment_questions);
// End Question

// Assessment
router.post(
  "/",
  [verify_token, is_email_valid, is_healer],
  controller.make_assessment
);
// End Assessment

module.exports = router;
