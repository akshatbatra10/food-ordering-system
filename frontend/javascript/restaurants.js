const coordinates = window.localStorage.getItem("coordinates");
const lat = JSON.parse(coordinates).lat;
const long = JSON.parse(coordinates).long;

const fetchRestaurants = async () => {
  try {
    const response = await fetch(
      `http://localhost:3000/restaurants/?lat=${lat}&long=${long}&${Date.now()}`
    );
    const restaurants = await response.json();
    console.log(restaurants);
  } catch (e) {
    console.log(e);
  }
};

window.addEventListener("load", function () {
  fetchRestaurants();
});
