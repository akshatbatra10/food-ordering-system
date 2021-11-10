const coordinates = window.localStorage.getItem("coordinates");
const lat = JSON.parse(coordinates).lat;
const long = JSON.parse(coordinates).long;
const restaurantCard = document.querySelector("#restaurantCard");
const showMore = document.querySelector("#status");
const showMoreButton = document.querySelector(".btn-danger");
const loading = document.querySelector("#loading");
const loader = document.querySelector(".loader");
const header = document.querySelector("#header");
const search = document.querySelector("#search");
const search_list = document.querySelector("#search-list");
const limit = 15;

let page = 1;
let restaurants;

const fetchRestaurants = async (url) => {
  try {
    const response = await fetch(url);
    restaurantsData = await response.json();
    restaurants = restaurantsData.results;
    console.log(restaurants);
    if (restaurantsData.next === undefined) {
      showMore.classList.add("none");
    } else {
      showMore.classList.remove("none");
    }
  } catch (e) {
    console.log(e);
  }
};

const addHTML = () => {
  const html = restaurants
    .map((restaurant) => {
      return `<div class="col-lg-4 col-md-6 col-sm-12">
      <div class="__area">
        <div class="__card" onclick="handleClick('${restaurant._id}')">
          <button class="__favorit"><i class="far fa-heart"></i></button>
          <img src="${restaurant.image}" class="img-fluid __img" />
          <div class="__card_detail text-left">
            <h4>${restaurant.name}</h4>
            <p>${restaurant.address}</p>
            <div class="__type">
              Average cost for two -
              <span><i class="fas fa-rupee-sign"></i> ${restaurant.average_cost_for_two}</span>
            </div>
            <div class="__detail">
              <div class="rating" style="background-color: #${restaurant.rating_color}">
                <i class="fas fa-star"></i> <span>${restaurant.aggregate_rating}</span>
              </div>
              <div class="timing">
                <i class="far fa-clock"></i> <span>30 m</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>`;
    })
    .join("");
  restaurantCard.insertAdjacentHTML("beforeend", html);
};

function handleClick(id) {
  window.localStorage.setItem("restaurantID", id);
  window.location = "restaurant.html";
}

const addList = (filteredRestaurants) => {
  search_list.classList.remove("none");
  const html = filteredRestaurants
    .map((restaurant) => {
      return `<div class="list" onclick="handleClick('${restaurant._id}')">
      <img src="${restaurant.image}" />
        <div style="margin-left: 0.8rem;" class="details">
          <h6 class="restaurant-name">${restaurant.name}</h6>
          <p class="restaurant-address">${restaurant.address}</p>
        </div>
      </div>`;
    })
    .join("");
  search_list.insertAdjacentHTML("beforeend", html);
};

window.addEventListener("load", async function () {
  const base_url = `http://localhost:3000/restaurants/?lat=${lat}&long=${long}&page=${page}&limit=${limit}&${Date.now()}`;
  header.classList.add("none");
  await fetchRestaurants(base_url);
  loading.classList.add("none");
  header.classList.remove("none");
  addHTML();
});

showMoreButton.addEventListener("click", async function () {
  loader.classList.remove("none");
  showMore.classList.add("none");
  page = page + 1;
  const base_url = `http://localhost:3000/restaurants/?lat=${lat}&long=${long}&page=${page}&limit=${limit}&${Date.now()}`;
  await fetchRestaurants(base_url);
  loader.classList.add("none");
  addHTML();
});

search.addEventListener("click", async function () {
  const base_url = `http://localhost:3000/restaurants/?lat=${lat}&long=${long}&page=1&limit=60&${Date.now()}`;
  await fetchRestaurants(base_url);
});

search.addEventListener("keyup", async function (e) {
  const list_items = document.querySelectorAll(".list");
  if (list_items !== null) {
    for (let list_item of list_items) {
      list_item.remove();
    }
  }
  let filteredRestaurants = [];
  const search_value = e.target.value.toLowerCase();
  if (search_value.length > 2) {
    search_list.classList.remove("none");
    const tempArray = restaurants.filter((restaurant) => {
      if (restaurant.name.toLowerCase().indexOf(search_value) !== -1) {
        return true;
      }
      return false;
    });
    const mySet = new Set(tempArray);
    filteredRestaurants = Array.from(mySet);
    addList(filteredRestaurants);
  } else {
    search_list.classList.add("none");
  }
});
