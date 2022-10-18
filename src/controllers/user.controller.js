const User = require("../models").User;
const profile_image = require("../models").profile_image;
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
    console.log("USERR", user_data);

    if (user_data.password !== undefined || user_data.password !== "") {
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

exports.get_all_profile_image = async (req, res) => {
  let response = {
    status: "failed",
    message: "",
    data: [],
  };
  try {
    const check_images = await profile_image.findAll();
    if (check_images.length === 0) {
      const images_data = [
        {
          image_id: 1,
          image_path: "/images/profile/user-1.png",
        },
      ];

      for (let i = 1; i <= 6; i++) {
        await profile_image.create({
          image_id: i,
          image_path: `/images/profile/user-${i}.png`,
        });
      }
    }

    const images = await profile_image.findAll({
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });
    response.status = "success";
    response.message = "Profile picture data retrieved";
    response.data = images;

    res.send(response);
  } catch (error) {
    response.message = error.message;
    res.send(response);
  }
};

