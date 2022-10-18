const fs = require("fs");

let rawdata = fs.readFileSync("./queue.json");
let queue = JSON.parse(rawdata);

exports.add_seeker_to_queue = () => {
  return queue;
};
