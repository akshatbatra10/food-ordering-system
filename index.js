if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const path = require("path");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("home.ejs");
});
app.get("/search", (req, res) => {
  res.render("searchbox.ejs");
});
app.get("/searchb", (req, res) => {
  res.render("search.ejs");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port - ${PORT}`);
});
