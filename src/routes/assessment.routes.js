const express = require("express");
const router = express.Router();

const { authJwt } = require("../middleware");
const controller = require("../controllers/assessment.controller");

router.get("/", controller.get_assessment_questions);

router.post("/", controller.create_assessment_questions);

module.exports = router;