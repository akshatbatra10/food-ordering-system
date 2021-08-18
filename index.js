const express = require("express");
const app = express();
const help = "NO";

app.get("/", (req, res) => {
  res.send("Working!!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port - ${PORT}`);
});
