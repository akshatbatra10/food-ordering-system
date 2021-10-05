const Users = require("../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const redisClient = require("../redis_connect");

async function Register(req, res) {
  try {
    const salt = await bcrypt.genSalt();
    const hiddenPassword = await bcrypt.hash(req.body.password, salt);
    const user = new Users({
      name: req.body.name,
      email: req.body.email,
      password: hiddenPassword,
    });
    await user.save();
    res.send("Successfully registered new user");
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
  const refreshToken = await generateRefreshToken(user);
  res.status(200).json({ token: token, refreshToken: refreshToken });
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

function Logout(req, res) {
  const user = req.userData;
  refreshTokens = refreshTokens.filter((token) => token._id != user._id);
  return res.send({ message: "logout success" });
}

async function generateRefreshToken(user) {
  const refreshToken = jwt.sign(
    { _id: user._id },
    process.env.REFRESH_ACCESS_TOKEN,
    {
      expiresIn: "7d",
    }
  );
  redisClient.get(user._id.toString(), (err, data) => {
    if (err) throw err;

    await redisClient.set(
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
};
