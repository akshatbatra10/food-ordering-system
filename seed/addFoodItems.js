const mongoose = require("mongoose");
const FoodData = require("./models/foodData");
const FoodItems = require("./foodData");

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

const addFoodItems = () => {
  try {
    FoodItems.map((data) => {
      data.items.map(async (item) => {
        const food = new FoodData({
          name: item.name,
          category: item.category,
          price: item.price,
          veg: item.veg,
          bestSeller: item.best_seller,
          image: item.img_url,
        });
        await food.save();
      });
    });
  } catch (err) {
    console.log(err);
  }
};

addFoodItems();
