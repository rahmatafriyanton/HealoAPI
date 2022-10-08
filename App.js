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

// include router
const auth_router = require("./src/routes/auth.routes");
app.use("/api/auth/", auth_router);

// include router
const assessment_router = require("./src/routes/assessment.routes");
app.use("/api/assessment/", assessment_router);

// include router
const user_route = require("./src/routes/user.routes");
app.use("/api/user/", user_route);

const PORT = process.env.PORT | 3000;
app.listen(PORT, async () => {
  console.log(`Server up on http://localhost:${PORT}`);
  await sequelize.authenticate({ alter: true });
  console.log("Database Connected!");
});
