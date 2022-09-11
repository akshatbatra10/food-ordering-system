const express = require("express");
const axios = require("axios");

//const client = require("../zomatoClient");
const Restaurants = require("../models/restaurants");
const FoodData = require("../models/foodData");

const router = express.Router();

router.get("/", async (req, res) => {
  const { lat, long } = req.query;
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const results = {};

  try {
    const response = await axios.get(
      `https://us1.locationiq.com/v1/reverse.php?key=pk.ac7f1895338e6b0b06892b14e6f747de&lat=${lat}&lon=${long}&format=json`
    );
    let location;
    if (!response.data.address.city) {
      location = "New Delhi";
    } else {
      location = response.data.address.city;
    }
    const size = await Restaurants.find({ city: location })
      .countDocuments()
      .exec();

    if (endIndex < size) {
      results.next = {
        page: page + 1,
        limit: limit,
      };
    }
    if (startIndex > 0) {
      results.previous = {
        page: page - 1,
        limit: limit,
      };
    }
    results.results = await Restaurants.find({ city: location })
      .limit(limit)
      .skip(startIndex)
      .exec();
    res.send(results);
  } catch (e) {
    console.log(e);
  }
});

router.get("/food", async (req, res) => {
  try {
    const foodData = await FoodData.find({});
    res.send(foodData);
  } catch (err) {
    console.log(err);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const restaurant = await Restaurants.findOne({ _id: id });
    // await client
    //   .getRestaurant({ res_id: restaurant.res_id })
    //   .then((response) => {
    //     console.log(response);
    //     number = response.phone_numbers.substring(
    //       response.phone_numbers.indexOf(" ") + 1,
    //       14
    //     );
    //   });
    restaurant.timing = "12PM - 1AM";
    restaurant.phone_numbers = 9811112323;
    res.send(restaurant);
  } catch (error) {
    console.log(error);
  }
});

router.get("/food/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const cartItem = await FoodData.find({ _id: id });
    res.send({ cartItem: cartItem[0] });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
