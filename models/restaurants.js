const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const restaurantSchema = new Schema({
    name: String,
    has_online_delivery: Number,
    image: String,
    cuisines: [String],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            require: true
        },
        coordinates: {
            type: [Number],
            require: true
        }
    },
    address: String,
    city: String,
    average_cost_for_two: Number
});

module.exports = mongoose.model('Restaurants', restaurantSchema);