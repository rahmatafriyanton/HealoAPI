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

// Chat
router.get("/", [verify_token, is_email_valid], controller.get_chat_list);

router.get(
  "/:room_id",
  [verify_token, is_email_valid],
  controller.get_chat_detail
);

router.post(
  "/sent_message",
  [verify_token, is_email_valid],
  controller.sent_message
);

router.post("/end_chat", [verify_token, is_email_valid], controller.end_chat);

// End Chat
module.exports = router;
