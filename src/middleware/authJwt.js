const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const User = require("../models").User;

verify_token = (req, res, next) => {
  let response = {
    status: "Failed",
    message: "",
    data: [],
  };

  let token = req.headers["x-access-token"];
  if (!token) {
    response.message = "No token provided!";
    return res.status(403).send(response);
  }
  jwt.verify(token, config.secret, async (err, decoded) => {
    if (err) {
      response.message = "Token is not valid!";
      return res.status(401).send(response);
    }

    const user = await User.findOne({
      where: {
        user_id: decoded.user_id,
      },
    });

    if (!user) {
      response.message = "User not found!";
      res.send(response);
    }

    req.user_id = user.user_id;
    next();
  });
};

is_email_valid = async (req, res, next) => {
  let response = {
    status: "Failed",
    message: "Email is not activated yet!",
    data: [],
  };

  const user = await User.findOne({
    where: {
      user_id: req.user_id,
    },
  });

  if (user && user.is_email_validated !== true) {
    return res.status(403).send(response);
  }
  next();
};
const authJwt = {
  verify_token,
  is_email_valid,
};
module.exports = authJwt;
