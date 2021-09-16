const express = require("express");
const axios = require("axios");

const Restaurants = require("../models/restaurants");

const router = express.Router();

router.get("/", async (req, res) => {
  const { lat, long } = req.body;
  try {
    const response = await axios.get(
      `https://us1.locationiq.com/v1/reverse.php?key=pk.ac7f1895338e6b0b06892b14e6f747de&lat=${lat}&lon=${long}&format=json`
    );
    const restaurants = await Restaurants.find({
      city: response.data.address.city,
    });
    res.send(restaurants);
  } catch (e) {
    console.log(e);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const restaurant = await Restaurants.findOne({ _id: id });
    res.send(restaurant);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
