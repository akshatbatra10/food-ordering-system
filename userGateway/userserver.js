if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const dbUrl = process.env.DB_CONNECTION_URL;

const Users = require("../models/users");

const app = express();

app.use(express.json());

mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Database connected");
});

app.post("/users/newuser", async (req, res) => {
  console.log(req.body);
  try {
    const salt = await bcrypt.genSalt();
    const hiddenPassword = await bcrypt.hash(req.body.password, salt);
    const user = new Users({
      name: req.body.name,
      email: req.body.email,
      password: hiddenPassword,
    });
    await user.save();
    res.send("success");
  } catch (e) {
    console.log(e);
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(PORT);
});
