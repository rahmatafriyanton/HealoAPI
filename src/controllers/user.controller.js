const User = require("../models").User;
const config = require("../config/auth.config");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

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
