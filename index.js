if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const mongoose = require("mongoose");
const fetch = require("node-fetch");
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Restaurants = require("./models/restaurants");
const Users = require("./models/users");

const dbUrl = process.env.DB_CONNECTION_URL;
const app = express();

mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Database connected");
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/restaurants", async (req, res) => {
  const { lat, long } = req.query;
  console.log(req.user);
  try {
    await fetch(
      `https://us1.locationiq.com/v1/reverse.php?key=pk.ac7f1895338e6b0b06892b14e6f747de&lat=${lat}&lon=${long}&format=json`,
      {
        method: "GET",
      }
    )
      .then((resp) => resp.json())
      .then((resp) => Restaurants.find({ city: resp.address.city }))
      .then((restaurants) => res.render("restaurants/index", { restaurants }));
  } catch (e) {
    console.log(e);
  }
});

app.get("/restaurants/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const restaurant = await Restaurants.findOne({ _id: id });
    res.render("restaurants/show", { restaurant });
  } catch (error) {
    console.log(error);
  }
});

app.post("/users/register", async (req, res) => {
  try {
    const salt = await bcrypt.genSalt();
    const hiddenPassword = await bcrypt.hash(req.body.password, salt);
    const user = new Users({
      email: req.body.email,
      password: hiddenPassword,
    });
    await user.save();
    res.send("success");
  } catch (e) {
    console.log(e);
  }
});

app.post("/users/login", async (req, res) => {
  const user = await Users.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Email not found");

  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) return res.status(400).send("Incorrect password");

  const token = jwt.sign({ _id: user._id }, process.env.ACCESS_TOKEN);
  res.json({ token: token });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port - ${PORT}`);
});
