if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const Restaurants = require("./models/restaurants");
const userRoutes = require("./routes/user.js");

const dbUrl = process.env.DB_CONNECTION_URL;
const PORT = process.env.PORT || 3000;

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

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("home");
});

app.use("/users", userRoutes);

app.get("/restaurants", async (req, res) => {
  const { lat, long } = req.query;
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

app.listen(PORT, () => {
  console.log(`Server started on port - ${PORT}`);
});
