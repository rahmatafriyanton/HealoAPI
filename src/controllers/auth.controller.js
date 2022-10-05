const db = require("../models/index");
const nodemailer = require("nodemailer");
const User = require("../models").User;
const config = require("../config/auth.config");
const Op = db.Sequelize.Op;
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const { user } = require("../models");

exports.register = async (req, res) => {
  // Save User to Database
  try {
    req.body.password = bcrypt.hashSync(req.body.password, 8);
    const createUser = await User.create(req.body);
    if (createUser) {
      const user = await User.findOne({
        where: {
          user_name: req.body.user_name,
        },
      });
      if (user) {
        const token = jwt.sign(
          {
            user_id: user.user_id,
            user_name: user.user_name,
            user_email: user.user_email,
            role_id: user.role_id,
          },
          config.secret,
          {
            expiresIn: 86400, // 24 hours
          }
        );
        res.send({
          status: "success",
          message: "Account has been created",
          data: {
            token: token,
          },
        });
      }
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.login = async (req, res) => {
  let response = {
    status: "Failed",
    message: "",
    data: [],
  };

  try {
    const user = await User.findOne({
      where: {
        user_email: req.body.user_email,
      },
    });

    if (!user) {
      response.message = "User Not Found.";
      return res.status(404).send(response);
    }

    var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

    if (!passwordIsValid) {
      response.message = "Invalid Password!";
      return res.status(401).send(response);
    }
    const token = jwt.sign(
      {
        user_id: user.user_id,
        user_name: user.user_name,
        user_email: user.user_email,
        role_id: user.role_id,
      },
      config.secret,
      {
        expiresIn: 86400, // 24 hours
      }
    );

    response.status = "success";
    response.message = "User was login successfully!";
    response.data = { token };
    res.send(response);
  } catch (error) {
    response.message = error.message;
    res.send(response);
  }
};

exports.sent_email = async (req, res) => {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: "healo.pencake@gmail.com", // generated ethereal user
      pass: "csgubglwzydqahxo", // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Healo" <healo.pencake@gmail.com>', // sender address
    to: "rahmatafriyanton@gmail.com", // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: "<b>Hello world?</b>", // html body
  });
  res.status(200).send(info);
};
