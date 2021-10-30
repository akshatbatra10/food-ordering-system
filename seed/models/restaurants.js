const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const restaurantSchema = new Schema({
  name: String,
  res_id: Number,
  has_online_delivery: Number,
  image: String,
  cuisines: [String],
  geometry: {
    type: {
      type: String,
      enum: ["Point"],
      require: true,
    },
    coordinates: {
      type: [Number],
      require: true,
    },
  },
  aggregate_rating: Number,
  rating_text: String,
  rating_color: String,
  votes: Number,
  address: String,
  city: String,
  average_cost_for_two: Number,
});

module.exports = mongoose.model("Restaurants", restaurantSchema);
