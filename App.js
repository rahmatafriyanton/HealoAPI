const express = require("express");
const bodyParser = require("body-parser");
var methodOverride = require("method-override");
const cors = require("cors");
const app = express();

const db = require("./src/models/");
db.sequelize.sync();

// parsing body request
app.use(
  cors({
    origin: "http://localhost:3001",
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

const PORT = process.env.PORT | 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
