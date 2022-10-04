const db = require("../models/index");
const User = require("../models").User;
check_username_email = async (req, res, next) => {
  let result = {
    status: "Failed",
    message: "",
    data: {},
  };
  try {
    // Username
    let user = await User.findOne({
      where: {
        user_name: req.body.user_name,
      },
    });
    if (user) {
      result.message = "Username is already in use!";
      return res.status(201).send(result);
    }
    // Email
    user = await User.findOne({
      where: {
        user_email: req.body.user_email,
      },
    });
    if (user) {
      result.message = "Email is already in use!";
      return res.status(201).send(result);
    }

    next();
  } catch (error) {
    result.message = error.message;
    return res.status(400).send(result);
  }
};
const verifySignUp = {
  check_username_email: check_username_email,
};
module.exports = verifySignUp;
