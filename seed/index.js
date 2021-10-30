const mongoose = require("mongoose");
const Restaurants = require("./models/restaurants");
const file1 = require("./file1");
const file2 = require("./file2");
const file3 = require("./file3");
const file4 = require("./file4");

mongoose.connect(
  "mongodb+srv://AkshatFOOD:gabbarsingh@cluster0.gia1c.mongodb.net/restaurantData?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
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
    file1.map((restaurant) =>
      restaurant.restaurants.map(async (data) => {
        const rest = new Restaurants({
          name: data.restaurant.name,
          res_id: data.restaurant.R.res_id,
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
          aggregate_rating: data.restaurant.user_rating.aggregate_rating,
          rating_text: data.restaurant.user_rating.rating_text,
          rating_color: data.restaurant.user_rating.rating_color,
          votes: data.restaurant.user_rating.votes,
          address: data.restaurant.location.address,
          city: data.restaurant.location.city,
          average_cost_for_two: data.restaurant.average_cost_for_two,
        });
        await rest.save();
      })
    );
    file2.map((restaurant) =>
      restaurant.restaurants.map(async (data) => {
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
      })
    );
    file3.map((restaurant) =>
      restaurant.restaurants.map(async (data) => {
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
      })
    );
    file4.map((restaurant) =>
      restaurant.restaurants.map(async (data) => {
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
      })
    );
  } catch (e) {
    console.log(e.error);
  }
};

seedDB();
// seedDB().then(() => mongoose.connection.close());
