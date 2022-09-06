const id = window.localStorage.getItem("restaurantID");
const restaurantImage = document.querySelector(".restaurant-image");
const restaurantName = document.querySelector(".restaurant-name");
const restaurantAdd = document.querySelector(".restaurant-address");

let restaurant;

const fetchData = async () => {
  try {
    const response = await fetch(
      `http://localhost:3000/restaurants/${id}?${Date.now()}`
    );
    restaurant = await response.json();
  } catch (error) {
    console.log(error);
  }
};

function addRestaurant() {
  console.log(restaurant);
  restaurantImage.src = restaurant.image;
  restaurantName.innerText = restaurant.name;
  restaurantAdd.innerText = restaurant.address;
}

window.addEventListener("load", async function () {
  await fetchData();
  addRestaurant();
});
