const express = require("express");
const router = express.Router();

const { validateSignup, authJwt } = require("../middleware");
const controller = require("../controllers/auth.controller");

router.post(
  "/register",
  [validateSignup.check_username_email],
  controller.register
);

router.post("/validate_email", authJwt.verify_token, controller.validate_email);

router.post("/login", controller.login);

router.post("/verify_token", authJwt.verify_token, (req, res) => {
  res.send({
    status: "success",
    message: "Token valid!",
    data: [],
  });
});

module.exports = router;
