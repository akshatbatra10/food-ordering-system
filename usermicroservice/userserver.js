if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const routes = require("./routes/user");

const dbUrl = process.env.DB_CONNECTION_URL;
const PORT = process.env.PORT || 3001;

const app = express();

app.use(cors());
app.use(express.json());

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

app.use("/", routes);

app.listen(PORT, () => {
  console.log("User microservice server started on port - " + PORT);
});
