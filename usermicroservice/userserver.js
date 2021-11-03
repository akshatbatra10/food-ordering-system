if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const routes = require("./routes/user");

const dbUrl = process.env.DB_CONNECTION_URL;
const PORT = process.env.PORT || 3001;

const app = express();

const corsOptions = {
  origin: true, //included origin as true
  credentials: true, //included credentials as true
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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

app.use("/", routes);

app.listen(PORT, () => {
  axios({
    method: "POST",
    url: "http://localhost:3000/register",
    headers: { "Content-Type": "application/json" },
    data: {
      apiName: "users",
      protocol: "http",
      host: "localhost",
      port: PORT,
    },
  }).then((response) => console.log(response.data));
  console.log("User microservice | PORT - " + PORT);
});
