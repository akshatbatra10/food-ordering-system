if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");
const cors = require("cors");
const cookieParser = require("cookie-parser");
// const path = require("path");

const dbUrl = process.env.DB_CONNECTION_URL;
const PORT = process.env.PORT || 3004;

const routes = require("./routes/restaurant");

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Database connected");
});

// app.use(express.static(path.join(__dirname, "frontend")));

app.use("/", routes);

app.listen(PORT, () => {
  axios({
    method: "POST",
    url: "http://localhost:3000/register",
    headers: { "Content-Type": "application/json" },
    data: {
      apiName: "restaurants",
      protocol: "http",
      host: "localhost",
      port: PORT,
    },
  }).then((response) => console.log(response.data));
  console.log(`Restaurant microservice | PORT - ${PORT}`);
});
