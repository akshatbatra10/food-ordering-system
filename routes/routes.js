const express = require("express");
const axios = require("axios");
const fs = require("fs");

const router = express.Router();

const registry = require("./registry.json");
const { request } = require("http");

router.post("/register", async (req, res) => {
  try {
    const registryInfo = req.body;
    registryInfo.url =
      registryInfo.protocol +
      "://" +
      registryInfo.host +
      ":" +
      registryInfo.port;
    if (apiAlreadyExists(registryInfo)) {
      res.send(
        "Configuration already exists for '" +
          registryInfo.apiName +
          "' at '" +
          registryInfo.url +
          "'"
      );
    } else {
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
    }
  } catch (error) {
    console.log(error);
  }
});

router.post("/unregister", (req, res) => {
  const registryInfo = req.body;
  if (apiAlreadyExists(registryInfo)) {
    const services = registry.services;
    delete services[registryInfo.apiName];
    registry.services = services;
    fs.writeFile(
      "./routes/registry.json",
      JSON.stringify(registry),
      (error) => {
        if (error)
          res.send(
            "Could not unregister '" + registryInfo.apiName + "'\n" + error
          );
        else {
          res.send("Successfully unregistered '" + registryInfo.apiName + "'");
        }
      }
    );
  } else {
    registryInfo.url =
      registryInfo.protocol +
      "://" +
      registryInfo.host +
      ":" +
      registryInfo.port;
    res.send(
      "Configuration does not exists for '" +
        registryInfo.apiName +
        "' at '" +
        registryInfo.url +
        "'"
    );
  }
});

router.all("/:apiname/*", async (req, res) => {
  try {
    let requestPath = req.originalUrl;
    requestPath = requestPath.split("/" + req.params.apiname).pop();
    await axios({
      method: req.method,
      url: registry.services[req.params.apiname].url + requestPath,
      headers: req.headers,
      data: req.body,
    })
      .then((response) => response.data)
      .then((response) => res.send(response));
  } catch (error) {
    console.log(error);
  }
});

const apiAlreadyExists = (registryInfo) => {
  return registry.services[registryInfo.apiName] != undefined;
};

module.exports = router;
