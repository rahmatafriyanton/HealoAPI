// const queue = require("../helpers/queue.helper.js");
const queue = [];

function addToQueue(data) {
  const { length } = queue;
  const id = length + 1;
  const found = queue.some((el) => el.seeker_id === data.seeker_id);
  if (!found) queue.push(data);
  return queue;
}

exports.find_healer = async (req, res) => {
  let response = {
    status: "success",
    message: "User added to queue!",
    data: [],
  };

  const payload = {
    seeker_id: req.user_id,
    healer_id: "",
    data: req.body,
  };

  addToQueue(payload);

  response.data = queue;
  res.send(response);
};

exports.add_healer_to_queue = (req, res) => {
  res.send(JSON.stringify(req.body));
};
