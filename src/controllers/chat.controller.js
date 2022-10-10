exports.find_healer = async (req, res) => {
  let response = {
    status: "failed",
    message: "",
    data: [],
  };

  try {
  } catch (error) {
    response.message = error.message;
    res.send(response);
  }
  res.send(response);
};
