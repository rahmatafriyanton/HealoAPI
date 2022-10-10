const nodemailer = require("nodemailer");
const moment = require("moment");
const config = require("../config/auth.config");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

const {
  findUserByUsername,
  findUserByEmail,
  findUserByUserID,
  createUser,
  updateUser,
} = require("../service/user.service");

exports.register = async (req, res) => {
  let response = {
    status: "failed",
    message: "",
    data: [],
  };

  let user_data = req.body;
  user_data.email_validation_key = Math.floor(1000 + Math.random() * 9000);
  user_data.email_validation_valid_until = new Date(Date.now() + 5 * 60 * 1000);

  // Save User to Database
  try {
    user_data.password = bcrypt.hashSync(user_data.password, 8);

    if (await createUser(user_data)) {
      const user = await findUserByUsername(req.body.user_name);

      if (user) {
        const token = createToken(user);
        // Send Validation Key Email
        await sent_email(user_data);

        response.status = "success";
        response.message = "Account has been created";
        response.data = { token };
        res.send(response);
      }
    }
  } catch (error) {
    response.message = error.message;
    res.status(500).send(response);
  }
};

exports.login = async (req, res) => {
  let response = {
    status: "failed",
    message: "",
    data: [],
  };

  try {
    const user = await findUserByEmail(req.body.user_email);

    if (!user) {
      response.message = "User Not Found.";
      return res.status(404).send(response);
    }

    var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

    if (!passwordIsValid) {
      response.message = "Invalid Password!";
      return res.status(401).send(response);
    }

    const token = createToken(user);

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
    const user = await findUserByUserID(req.user_id);

    if (!user) {
      response.message = "User Not Found.";
      return res.status(404).send(response);
    }
    if (moment() > moment(user.email_validation_valid_until)) {
      response.message = "Validation key expired!";
      return res.status(403).send(response);
    }

    const { email_validation_key } = req.body;

    if (user.email_validation_key !== email_validation_key) {
      response.message = "Validation key not valid!";
      return res.status(403).send(response);
    } else {
      const new_user_data = {
        is_email_validated: 1,
        user_id: req.user_id,
      };

      if (await updateUser(new_user_data)) {
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
  return info;
}

function createToken(data) {
  const { user_id, user_name, user_email, role_id } = data;
  const token = jwt.sign(
    {
      user_id,
      user_name,
      user_email,
      role_id,
    },
    config.secret,
    {
      expiresIn: 86400, // 24 hours
    }
  );

  return token;
}
