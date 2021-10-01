const coordinates = window.localStorage.getItem("coordinates");
const lat = JSON.parse(coordinates).lat;
const long = JSON.parse(coordinates).long;
const restaurantCard = document.querySelector("#restaurantCard");

let restaurants;

const fetchRestaurants = async () => {
  try {
    const response = await fetch(
      `http://localhost:3000/restaurants/?lat=${lat}&long=${long}&${Date.now()}`
    );
    restaurants = await response.json();
    console.log(restaurants);
  } catch (e) {
    console.log(e);
  }
};

window.addEventListener("load", async function () {
  await fetchRestaurants();
  const html = restaurants
    .map((restaurant) => {
      return `<div class="col-lg-4 col-md-6 col-sm-12">
      <div class="__area text-center">
        <a href="#" class="__card">
          <button class="__favorit"><i class="far fa-heart"></i></button>
          <img src="${restaurant.image}" class="img-fluid __img" />
          <div class="__card_detail text-left">
            <h4>${restaurant.name}</h4>
            <p>${restaurant.address}</p>
            <div class="__type">
              Average cost for two -
              <span>${restaurant.average_cost_for_two}</span>
            </div>
            <div class="__detail">
              <i class="far fa-star"></i> <span>5.0</span>
              <i class="far fa-clock"></i> <span>30 m</span>
            </div>
          </div>
        </a>
      </div>
    </div>`;
    })
    .join("");
  restaurantCard.insertAdjacentHTML("afterbegin", html);
});
