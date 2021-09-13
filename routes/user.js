const express = require("express");
const fs = require("fs");
const router = express.Router();
const { default: axios } = require("axios");

// const Users = require("../userGateway/models/user");
const registry = require("./registry.json");

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

router.all("/:type", async (req, res) => {
  try {
    await axios({
      method: req.method,
      url: registry.services["users"].url + req.params.type,
      headers: req.headers,
      data: req.body,
    })
      .then((response) => response.data)
      .then((response) => res.send(response));
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
