const coordinates = window.localStorage.getItem("coordinates");
const lat = JSON.parse(coordinates).lat;
const long = JSON.parse(coordinates).long;
const restaurantCard = document.querySelector("#restaurantCard");
const showMore = document.querySelector("#status");
const showMoreButton = document.querySelector(".btn-danger");
const loading = document.querySelector('#loading');
const loader = document.querySelector('.loader')
const limit = 15;

let page = 1;
let restaurants;

const fetchRestaurants = async () => {
  try {
    const response = await fetch(
      `http://localhost:3000/restaurants/?lat=${lat}&long=${long}&page=${page}&limit=${limit}&${Date.now()}`
    );
    restaurantsData = await response.json();
    restaurants = restaurantsData.results;
    console.log(restaurants);
    if (restaurantsData.next === undefined) {
      showMore.classList.add("none");
    } else {
      showMore.classList.remove('none');
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
        <a href="#" class="__card">
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
              <div class="rating">
                <i class="fas fa-star"></i> <span>5.0</span>
              </div>
              <div class="timing">
                <i class="far fa-clock"></i> <span>30 m</span>
              </div>
            </div>
          </div>
        </a>
      </div>
    </div>`;
    })
    .join("");
  restaurantCard.insertAdjacentHTML("beforeend", html);
};

window.addEventListener("load", async function () {
  loader.classList.add('none');
  await fetchRestaurants();
  loading.classList.add('none');
  addHTML();
});

showMoreButton.addEventListener("click", async function () {
  loader.classList.remove('none');
  showMore.classList.add('none');
  page = page + 1;
  await fetchRestaurants();
  loader.classList.add('none');
  addHTML();
});
