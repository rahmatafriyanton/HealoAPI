const express = require("express");
const router = express.Router();

const { authJwt } = require("../middleware");
const controller = require("../controllers/chat.controller");
const { verify_token, is_email_valid, is_healer, is_seeker, verifyAccess } =
  authJwt;

router.post(
  "/find_healer",
  [verify_token, is_email_valid, is_seeker],
  controller.find_healer
);

router.post(
  "/healer/queue",
  [verify_token, is_email_valid, is_healer],
  controller.add_healer_available
);
module.exports = router;
