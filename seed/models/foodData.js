const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const foodDataSchema = new Schema({
  name: String,
  category: String,
  image: String,
  price: Number,
  bestSeller: Boolean,
  veg: Boolean,
});

module.exports = mongoose.model("FoodData", foodDataSchema);
