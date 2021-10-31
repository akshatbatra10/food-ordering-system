const id = window.localStorage.getItem("restaurantID");
const displayData = document.querySelector("#display");
const nav = document.querySelector("#navbar");
const cuisines = document.querySelector(".cuisines");
const avgPrice = document.querySelector(".price");
const number = document.querySelector(".number");
const map = document.querySelector("#static-map");
const directionLink = document.querySelectorAll(".link");
const loader = document.querySelector("#loading");
const afterLoad = document.querySelector(".afterloading");
const timing = document.querySelector(".timing");

let restaurant;

const fetchData = async () => {
  try {
    const response = await fetch(
      `http://localhost:3000/restaurants/${id}?${Date.now()}`
    );
    restaurant = await response.json();
    console.log(restaurant);
  } catch (error) {
    console.log(error);
  }
};

const addHTML = () => {
  const html = `<div class="restaurantData">
    <h1>${restaurant.name}</h1>
    <p>${restaurant.address}</p>
    <div class="rating">
      <i class="far fa-star active"></i><i class="far fa-star active"></i><i class="far fa-star active"></i><i class="far fa-star"></i><i class="far fa-star"></i>
      <span>(${restaurant.votes}) reviews</span>
    </div>
  </div>
  <img style="height: 13rem; border-radius: 2rem; padding: 1rem" src="${restaurant.image}" />`;
  displayData.insertAdjacentHTML("beforeend", html);
};

const addCuisines = () => {
  const html = restaurant.cuisines
    .map((cuisine) => {
      return `<span class="cuisine">${cuisine}</span>`;
    })
    .join("");
  cuisines.insertAdjacentHTML("beforeend", html);
};

const addRestaurantMap = () => {
  mapboxgl.accessToken =
    "pk.eyJ1IjoiYWtzaGF0LWJhdHJhIiwiYSI6ImNrazB1cWJxajBsNDkycHRnaXVmbTVyNmkifQ.wPpiFWa1zLQYQUnhr-uCGQ";
  const map = new mapboxgl.Map({
    container: "map", // container ID
    style: "mapbox://styles/mapbox/streets-v11", // style URL
    center: [
      restaurant.geometry.coordinates[0],
      restaurant.geometry.coordinates[1],
    ], // starting position [lng, lat]
    zoom: 12, // starting zoom
  });
  const marker = new mapboxgl.Marker()
    .setLngLat([
      restaurant.geometry.coordinates[0],
      restaurant.geometry.coordinates[1],
    ])
    .addTo(map);
};

window.addEventListener("load", async function () {
  await fetchData();
  addHTML();
  addRestaurantMap();
  addCuisines();
  for (let link of directionLink) {
    link.href = `https://www.google.com/maps/dir/?api=1&destination=${restaurant.geometry.coordinates[1]},${restaurant.geometry.coordinates[0]}`;
  }
  avgPrice.innerText = restaurant.average_cost_for_two;
  number.innerText = `+91-${restaurant.phone_numbers}`;
  timing.innerText = restaurant.timing;
  loader.classList.add("none");
  afterLoad.classList.remove("none");
});
