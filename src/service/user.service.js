const User = require("../models").User;

exports.findUserByUserID = async (user_id, attr=false) => {
  return await User.findOne({
    raw: true,
    where: {
      user_id,
    },
    attributes: attr ? {
      exclude: [
        "createdAt",
        "updatedAt",
        "email_validation_key",
        "email_validation_valid_until",
        "is_accept_agreement",
        "agreement_time",
        "password",
      ],
    } : {},
  });
};

exports.findUserByUsername = async (user_name) => {
  return await User.findOne({
    raw: true,
    where: {
      user_name,
    },
  });
};

exports.findUserByEmail = async (user_email) => {
  return await User.findOne({
    raw: true,
    where: {
      user_email,
    },
  });
};

exports.createUser = async (user_data) => {
  return await User.create(user_data);
};

exports.updateUser = async (user_data) => {
  const update = await User.update(user_data, {
    where: { user_id: user_data.user_id },
  });

  return update;
};
