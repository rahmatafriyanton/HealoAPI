const express = require("express");
const router = express.Router();

const { authJwt } = require("../middleware");
const controller = require("../controllers/user.controller");

router.post(
  "/update_profile",
  [authJwt.verify_token],
  controller.update_profile
);

module.exports = router;
