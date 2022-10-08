const express = require("express");
const router = express.Router();

const { authJwt } = require("../middleware");
const controller = require("../controllers/user.controller");

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
