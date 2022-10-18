const express = require("express");
const router = express.Router();

const { authJwt } = require("../middleware");
const controller = require("../controllers/user.controller");

const { verify_token, is_email_valid, is_healer, is_seeker, verifyAccess } =
  authJwt;

router.get(
  "/",
  [authJwt.verify_token, authJwt.is_email_valid],
  controller.get_profile
);
router.post(
  "/",
  [authJwt.verify_token, authJwt.is_email_valid],
  controller.update_profile
);

router.get(
  "/profile_images",
  [authJwt.verify_token, authJwt.is_email_valid],
  controller.get_all_profile_image
);

module.exports = router;
