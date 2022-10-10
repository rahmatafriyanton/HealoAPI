const express = require("express");
const bodyParser = require("body-parser");
var methodOverride = require("method-override");
const cors = require("cors");
const app = express();

const { sequelize } = require("./src/models/");

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

// Images
app.use(express.static("public"));
app.use("/images", express.static("images"));

// Socket
const io = require("socket.io")(3001, {
  cors: {
    origin: ["*"],
  },
});

const healer_available = [];

io.on("connection", (socket) => {
  socket.on("make_connection", (user_id) => {
    socket.join(user_id);
  });

  socket.on("set_healer_available", (user_id) => {
    healer_available.push(user_id);
  });

  socket.on("find_healer", (user_id) => {});
});

const PORT = process.env.PORT | 3000;
app.listen(PORT, async () => {
  console.log(`Server up on http://localhost:${PORT}`);
  await sequelize.authenticate({ alter: true });
  console.log("Database Connected!");
});
