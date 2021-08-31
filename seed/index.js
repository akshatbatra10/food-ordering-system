const mongoose = require("mongoose");
const Restaurants = require("../models/restaurants");
const restaurantData = require("./restaurantData");

mongoose.connect(
  "mongodb+srv://AkshatBatra:g0t0@he11@cluster0.gia1c.mongodb.net/restaurantData?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    connectTimeoutMS: 3000,
  }
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Database connected");
});

const seedDB = async () => {
  await Restaurants.deleteMany({});
  try {
    restaurantData.map(restaurant => restaurant.restaurants.map(async (data) => {
      const rest = new Restaurants({
        name: data.restaurant.name,
        has_online_delivery: data.restaurant.has_online_delivery,
        image: data.restaurant.featured_image,
        cuisines: data.restaurant.cuisines.split(", "),
        geometry: {
          type: "Point",
          coordinates: [
            data.restaurant.location.longitude,
            data.restaurant.location.latitude,
          ],
        },
        address: data.restaurant.location.address,
        city: data.restaurant.location.city,
        average_cost_for_two: data.restaurant.average_cost_for_two,
      });
      await rest.save();
    }));
  } catch (e) {
    console.log(e.error);
  }
};

seedDB();
// seedDB().then(() => mongoose.connection.close());
