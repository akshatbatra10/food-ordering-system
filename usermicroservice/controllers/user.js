const Users = require("../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const redisClient = require("../redis_connect");

async function Details(req, res) {
  try {
    const { id } = req.params;
    const user = await Users.findOne({ _id: id });
    res.send(user);
  } catch (e) {
    console.log(e);
  }
}

async function AddToWishList(req, res) {
  try {
    const id = req.body.userId;
    const resID = req.body.id;
    const user = await Users.updateOne({
      _id: id,
      $push: { bookmarks: resID },
    });
    res.send("Success");
  } catch (e) {
    console.log(e);
  }
}

async function RemoveFromWishList(req, res) {
  try {
    const id = req.body.userId;
    const resID = req.body.id;
    const user = await Users.updateOne({
      _id: id,
      $pull: { bookmarks: resID },
    });
    res.send("Success");
  } catch (e) {
    console.log(e);
  }
}

async function Register(req, res) {
  try {
    const salt = await bcrypt.genSalt();
    const hiddenPassword = await bcrypt.hash(
      req.body.password.toString(),
      salt
    );
    const user = new Users({
      name: req.body.name,
      email: req.body.email,
      password: hiddenPassword,
    });
    await user.save();
    const token = jwt.sign({ _id: user._id }, process.env.ACCESS_TOKEN, {
      expiresIn: "30s",
    });
    const refreshToken = generateRefreshToken(user);
    res.cookie("jwt", token, { maxAge: 60 * 60 * 24 * 1000 });
    res
      .status(200)
      .json({ token: token, refreshToken: refreshToken, id: user._id });
    // res.send("Successfully registered new user");
  } catch (e) {
    console.log(e);
  }
}

async function Login(req, res) {
  const user = await Users.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Email not found");

  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) return res.status(400).send("Incorrect password");

  const token = jwt.sign({ _id: user._id }, process.env.ACCESS_TOKEN, {
    expiresIn: "30s",
  });
  const refreshToken = generateRefreshToken(user);
  // res.setHeader("Set-Cookie", token);
  await res.cookie("jwt", token, { maxAge: 60 * 60 * 24 * 1000 });
  res.json({ token: token, refreshToken: refreshToken, id: user._id });
}

async function Token(req, res) {
  const user = req.userData;
  const accessToken = jwt.sign({ _id: user._id }, process.env.ACCESS_TOKEN, {
    expiresIn: "30s",
  });
  const refreshToken = generateRefreshToken(user);
  return res.json({
    message: "success",
    data: { accessToken, refreshToken },
  });
}

async function Logout(req, res) {
  const user = req.userData;
  const token = req.token;
  await redisClient.del(user._id.toString());
  await redisClient.set("BL" + user._id.toString(), token);
  return res.send({ message: "logout success" });
}

function generateRefreshToken(user) {
  const refreshToken = jwt.sign(
    { _id: user._id },
    process.env.REFRESH_ACCESS_TOKEN,
    {
      expiresIn: "1d",
    }
  );
  redisClient.get(user._id.toString(), (err, data) => {
    if (err) throw err;

    redisClient.set(
      user._id.toString(),
      JSON.stringify({ token: refreshToken })
    );
  });
  return refreshToken;
}

module.exports = {
  Register,
  Login,
  Token,
  Logout,
  Details,
  AddToWishList,
  RemoveFromWishList,
};
