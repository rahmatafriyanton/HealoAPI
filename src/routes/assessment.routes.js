const express = require("express");
const router = express.Router();
const { authJwt } = require("../middleware");
const controller = require("../controllers/assessment/");

// Question
router.get(
  "/question",
  [authJwt.verify_token, authJwt.is_email_valid],
  controller.get_assessment_questions
);
router.post("/question", controller.create_assessment_questions);
// End Question

// Assessment
router.post(
  "/",
  [authJwt.verify_token, authJwt.is_email_valid],
  controller.make_assessment
);
// End Assessment

module.exports = router;
