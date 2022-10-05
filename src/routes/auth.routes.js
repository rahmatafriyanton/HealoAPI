const express = require("express");
const router = express.Router();

const { validateSignup } = require("../middleware");
const controller = require("../controllers/auth.controller");

router.post(
  "/register",
  [validateSignup.check_username_email],
  controller.register
);

router.post("/login", controller.login);

router.get("/sent_email", controller.sent_email);

module.exports = router;
