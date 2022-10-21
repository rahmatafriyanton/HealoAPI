const express = require("express");
const bodyParser = require("body-parser");
var methodOverride = require("method-override");
const cors = require("cors");
const app = express();

const queue = require("./src/helpers/queue.helper.js");

const { sequelize } = require("./src/models/");

// Socket
const io = require("socket.io")(3001, {
  cors: {
    origin: ["*"],
  },
});

io.on("connection", (socket) => {
  socket.on("create_connection", (user_id) => {
    socket.join(user_id);
  });

  socket.on("confirm_pairing", (pair_confirm) => {
    console.log("Pair Confirm", pair_confirm);
    queue.confirm_pairing(io, JSON.parse(pair_confirm));
  });
});

// const db = require("./src/models/");
// db.sequelize.sync({ force: true });
// parsing body request
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.use(function (req, res, next) {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  req.io = io;
  next();
});

app.get("/", (req, res) => {
  res.json({ message: "It works" });
});

// include auth router
const auth_router = require("./src/routes/auth.routes");
app.use("/api/auth/", auth_router);

// include assessment router
const assessment_router = require("./src/routes/assessment.routes");
app.use("/api/assessment/", assessment_router);

// include user router
const user_route = require("./src/routes/user.routes");
app.use("/api/user/", user_route);

// include chat router
const chat_route = require("./src/routes/chat.routes");
app.use("/api/chat/", chat_route);

const cron = require("node-cron");
const { pair_the_user } = require("./src/controllers/chat.controller");
cron.schedule("* * * * * *", function () {
  pair_the_user(io);
});

// Images
app.use(express.static("public"));
app.use("/images", express.static("images"));

const PORT = process.env.PORT | 3000;
app.listen(PORT, async () => {
  console.log(`Server up on http://localhost:${PORT}`);
  await sequelize.authenticate({ alter: true });
  console.log("Database Connected!");
});
