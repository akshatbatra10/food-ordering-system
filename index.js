if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");

const routes = require("./routes/routes");

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

// app.set("views", path.join(__dirname, "views"));

app.use(cors());
// app.use(helmet());
app.use(express.json());
app.use(express.static(path.join(__dirname, "frontend")));

app.get("/", (req, res) => {
  res.redirect("home.html");
});

app.use("/", routes);

app.listen(PORT, () => {
  console.log(`Main API gateway server started on port - ${PORT}`);
});
