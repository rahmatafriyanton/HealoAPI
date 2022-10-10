const User = require("../models").User;

exports.findUserByUserID = async (user_id) => {
  return await User.findOne({
    where: {
      user_id,
    },
  });
};

exports.findUserByUsername = async (user_name) => {
  return await User.findOne({
    where: {
      user_name,
    },
  });
};

exports.findUserByEmail = async (user_email) => {
  return await User.findOne({
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
