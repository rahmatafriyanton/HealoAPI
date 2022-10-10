const {
  findUserByUsername,
  findUserByEmail,
} = require("../service/user.service");

check_username_email = async (req, res, next) => {
  let result = {
    status: "failed",
    message: "",
    data: {},
  };
  try {
    // Username
    if (await findUserByUsername(req.body.user_name)) {
      result.message = "Username is already in use!";
      return res.status(201).send(result);
    }

    // Email
    if (await findUserByEmail(req.body.user_email)) {
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
  check_username_email,
};
module.exports = verifySignUp;
