const User = require("../models").User;
const config = require("../config/auth.config");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.get_profile = async (req, res) => {
  let response = {
    status: "failed",
    message: "",
    data: [],
  };
  const user_id = req.query.id;
  if (user_id === undefined || user_id === "") {
    response.message = "User ID required!";
    return res.send(response);
  }
  try {
    const user = await User.findOne({
      where: {
        user_id: req.query.id,
      },
      attributes: {
        exclude: [
          "createdAt",
          "updatedAt",
          "email_validation_key",
          "email_validation_valid_until",
          "is_accept_agreement",
          "agreement_time",
          "password",
        ],
      },
    });

    if (user) {
      response.status = "success";
      response.message = "User profile data retrieved";
      response.data = user;
    } else {
      response.message = "User not found!";
    }
    res.send(response);
  } catch (error) {
    response.message = error.message;
    res.send(response);
  }
};

exports.update_profile = async (req, res) => {
  let response = {
    status: "Failed",
    message: "",
    data: [],
  };

  try {
    const user = await User.findOne({
      where: {
        user_id: req.user_id,
      },
    });

    if (!user) {
      response.message = "User Not Found.";
      return res.status(404).send(response);
    }

    let user_data = req.body;

    if (user_data.password !== "") {
      user_data.password = bcrypt.hashSync(user_data.password, 8);
    }

    const update = await User.update(user_data, {
      where: { user_id: req.user_id },
    });

    if (update) {
      response.status = "success";
      response.message = "Profile updated successfully!";
      res.status(200).send(response);
    }
  } catch (error) {
    response.message = error.message;
    res.send(response);
  }
};
