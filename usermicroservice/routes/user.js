const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Users = require("../models/users");

const router = express.Router();

let refreshTokens = [];

function generateAccessToken(user) {
  return jwt.sign({ _id: user._id }, process.env.ACCESS_TOKEN, {
    expiresIn: "15s",
  });
}

router.post("/token", (req, res) => {
  const refreshToken = req.body.token;
  if (refreshToken === null) return res.sendStatus(401);
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);
  jwt.verify(refreshToken, process.env.REFRESH_ACCESS_TOKEN, (err, user) => {
    if (err) return res.sendStatus(403);
    const accessToken = generateAccessToken(user);
    res.json({ accessToken: accessToken });
  });
});

router.post("/registeruser", async (req, res) => {
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

router.post("/login", async (req, res) => {
  const user = await Users.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Email not found");

  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) return res.status(400).send("Incorrect password");

  const token = generateAccessToken(user);
  const refreshToken = jwt.sign(
    { _id: user._id },
    process.env.REFRESH_ACCESS_TOKEN
  );
  refreshTokens.push(refreshToken);
  res.status(200).json({ token: token, refreshToken: refreshToken });
});

router.delete("/logout", (req, res) => {
  refreshTokens = refreshTokens.filter((token) => token !== req.body.token);
  res.sendStatus(204);
});

module.exports = router;
