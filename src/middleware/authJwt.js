const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const User = require("../models").User;
const assesment_attempt = require("../models").assesment_attempt;

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

is_healer = async (req, res, next) => {
  let result = {
    status: "Failed",
    message: "",
    data: {},
  };
  try {
    let user = await User.findOne({
      where: {
        user_id: req.user_id,
      },
    });

    if (user && user.role_id !== 1) {
      response.message = "You don't have rights to access this service";
      res.send(response);
    }

    next();
  } catch (error) {
    result.message = error.message;
    return res.status(400).send(result);
  }
};

is_seeker = async (req, res, next) => {
  let result = {
    status: "failed",
    message: "",
    data: {},
  };
  try {
    let user = await User.findOne({
      where: {
        user_id: req.user_id,
      },
    });

    if (user && user.role_id !== 2) {
      response.message = "You don't have rights to access this service";
      res.send(response);
    }

    next();
  } catch (error) {
    result.message = error.message;
    return res.status(400).send(result);
  }
};

verifyAccess = async (req, res, next) => {
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

  if (user && user.role_id === 1) {
    try {
      const assessment = await assesment_attempt.findOne({
        where: {
          user_id: req.user_id,
        },
        order: [["createdAt", "DESC"]],
      });

      if (!assessment || !assessment.status) {
        response.message = "Healer should pass the assessment test first!";
        res.send(response);
      }
    } catch (error) {
      response.message = error.message;
      res.send(response);
    }
  }

  next();
};

const authJwt = {
  verify_token,
  is_email_valid,
  is_healer,
  is_seeker,
  verifyAccess,
};
module.exports = authJwt;
