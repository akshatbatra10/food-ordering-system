const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Users = require("../models/users");

const router = express.Router();

let refreshTokens = [];

function generateAccessToken(user) {
  return jwt.sign({ _id: user._id }, process.env.ACCESS_TOKEN, {
    expiresIn: "30s",
  });
}

function generateRefreshToken(user) {
  const refreshToken = jwt.sign(
    { _id: user._id },
    process.env.REFRESH_ACCESS_TOKEN,
    {
      expiresIn: "7d",
    }
  );
  let storedRefreshToken = refreshTokens.find((token) => token._id == user._id);
  if (storedRefreshToken === undefined) {
    refreshTokens.push({
      _id: user._id,
      token: refreshToken,
    });
  } else {
    refreshTokens[
      refreshTokens.findIndex((token) => token._id == user._id)
    ].token = refreshToken;
  }
  return refreshToken;
}

router.post("/token", verifyRefreshToken, (req, res) => {
  const user = req.userData;
  const accessToken = jwt.sign({ _id: user._id }, process.env.ACCESS_TOKEN, {
    expiresIn: "30s",
  });
  const refreshToken = generateRefreshToken(user);
  return res.json({ message: "success", data: { accessToken, refreshToken } });
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
  const refreshToken = generateRefreshToken(user);
  res.status(200).json({ token: token, refreshToken: refreshToken });
});

router.post("/logout", verifyAccessToken, (req, res) => {
  const user = req.userData;
  refreshTokens = refreshTokens.filter((token) => token._id != user._id);
  return res.send({ message: "logout success" });
});

router.get("/dashboard", verifyAccessToken, (req, res) => {
  res.send("hello from dashboard");
});

function verifyAccessToken(req, res, next) {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);
    req.userData = decoded;
    next();
  } catch (error) {
    return res.send({ message: "Not authorized", data: error });
  }
}

function verifyRefreshToken(req, res, next) {
  const token = req.body.token;
  if (token === null)
    return res.status(401).json({ status: false, message: "Not authorized" });
  try {
    const decoded = jwt.verify(token, process.env.REFRESH_ACCESS_TOKEN);
    req.userData = decoded;
    let storedRefreshToken = refreshTokens.find((x) => x._id == decoded._id);
    if (storedRefreshToken === undefined) {
      return res.send({ message: "Not authorized, token not stored 1" });
    }
    if (storedRefreshToken.token != token) {
      return res.send({ message: "Not authorized, token not stored" });
    }
    next();
  } catch (error) {
    res.status(401).json({ message: "Not authorized", data: error });
  }
}

module.exports = router;
