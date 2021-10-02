const mongoose = require("mongoose");
const Restaurants = require("./models/restaurants");

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

const addImage = async () => {
  try {
    await Restaurants.updateMany(
      { image: "" },
      {
        $set: {
          image:
            "https://images.unsplash.com/photo-1514933651103-005eec06c04b?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1074&q=80",
        },
      }
    );
  } catch (e) {
    console.log(e);
  }
};

addImage();
