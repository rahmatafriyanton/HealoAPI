const nodemailer = require("nodemailer");
const User = require("../models").User;
const config = require("../config/auth.config");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.register = async (req, res) => {
  let user_data = req.body;
  user_data.email_validation_key = Math.floor(1000 + Math.random() * 9000);
  user_data.email_validation_valid_until = new Date(Date.now() + 5 * 60 * 1000);
  // Save User to Database
  try {
    user_data.password = bcrypt.hashSync(user_data.password, 8);
    const createUser = await User.create(user_data);
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
        await sent_email(user_data);

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

exports.validate_email = async (req, res) => {
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

    if (user.email_validation_valid_until < new Date()) {
      response.message = "Validation key expired!";
      return res.status(403).send(response);
    }
    console.log("USERR", user);
    if (user.email_validation_key !== req.body.email_validation_key) {
      response.message = "Validation key not valid!";
      return res.status(403).send(response);
    } else {
      const update = await User.update(
        { is_email_validated: 1 },
        { where: { user_id: req.user_id } }
      );

      if (update) {
        response.status = "success";
        response.message = "Email activated successfully!";
        return res.status(200).send(response);
      } else {
        response.message = "Email activation failed!";
        return res.status(403).send(response);
      }
    }
  } catch (error) {
    res.send(error.message);
  }
};

async function sent_email(user_data) {
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
    to: user_data.user_email, // list of receivers
    subject: "Healo Email Validation", // Subject line
    text: "", // plain text body
    html: `<p>Hello, ${user_data.user_name}. Here is your email validation code: </p><br/><b>${user_data.email_validation_key}</b>`, // html body
  });
  console.log("INFOOO", info);
  return info;
}
