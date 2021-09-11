const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const router = express.Router();

const registry = require("./registry.json");
const { default: axios } = require("axios");

router.post("/register", async (req, res) => {
  try {
    const registryInfo = req.body;
    registry.services[registryInfo.apiName] = { ...registryInfo };
    fs.writeFile(
      "./routes/registry.json",
      JSON.stringify(registry),
      (error) => {
        if (error)
          res.send(
            "Could not register '" + registryInfo.apiName + "'\n" + error
          );
        else {
          res.send("Successfully registered '" + registryInfo.apiName + "'");
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
});

// app.post("/users/register", async (req, res) => {
//   try {
//     const salt = await bcrypt.genSalt();
//     const hiddenPassword = await bcrypt.hash(req.body.password, salt);
//     const user = new Users({
//       email: req.body.email,
//       password: hiddenPassword,
//     });
//     await user.save();
//     res.send("success");
//   } catch (e) {
//     console.log(e);
//   }
// });

router.post("/login", async (req, res) => {
  const user = await Users.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Email not found");

  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) return res.status(400).send("Incorrect password");

  const token = jwt.sign({ _id: user._id }, process.env.ACCESS_TOKEN);
  res.json({ token: token });
});

router.all("/:apiname/:type", async (req, res) => {
  try {
    await axios({
      method: req.method,
      url: registry.services[req.params.apiname] + req.params.type,
      headers: req.headers,
      data: req.body,
    })
      .then((response) => response.text())
      .then((response) => console.log(response));
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
