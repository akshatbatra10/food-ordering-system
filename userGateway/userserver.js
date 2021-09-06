const express = require("express");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const Users = require("../models/users");

const app = express();

app.use(express.json());
const dbUrl =
  "mongodb+srv://AkshatBatra:g0t0@he11@cluster0.gia1c.mongodb.net/restaurantData?retryWrites=true&w=majority";

mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  // useCreateIndex: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Database connected");
});

app.post("/users/register", async (req, res) => {
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

PORT = 3001;
app.listen(PORT, () => {
  console.log(PORT);
});
