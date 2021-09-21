const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Users = require("../models/users");

const router = express.Router();

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

  const token = jwt.sign({ _id: user._id }, process.env.ACCESS_TOKEN);
  res.json({ token: token });
});

module.exports = router;