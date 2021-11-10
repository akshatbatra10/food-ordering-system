const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cartSchema = new Schema({
  name: String,
  image: String,
  price: Number,
  veg: Boolean,
});

module.exports = mongoose.model("Cart", cartSchema);
