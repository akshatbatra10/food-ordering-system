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
const menu = document.querySelector(".menu");
const recommended = document.querySelector("#recommended");
const pizza = document.querySelector("#pizza");
const burger = document.querySelector("#burger");
const cartBody = document.querySelector(".cart-body");
const addButton = document.querySelector(".add_button");
const cartTitle = document.querySelector("#cart-title");
const displayCartItem = document.querySelector("#cart-item");
const cartPayment = document.querySelector(".cart-payment");

let restaurant;
let foodData;
let cartArray = [];
let cartItems = [];
let cartCount = 0;

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

const addFoodHTML = () => {
  const recommendedArray = foodData.filter(
    (data) => data.category == "Recommended"
  );
  const pizzaArray = foodData.filter((data) => data.category == "Pizzas");
  const burgersArray = foodData.filter((data) => data.category == "Burgers");
  const others = foodData.filter(
    (data) =>
      data.category != "Recommended" &&
      data.category != "Pizzas" &&
      data.category != "Burgers"
  );
  const recommendedHTML = recommendedArray
    .map((item) => {
      return `<div class="food d-flex my-3">
      <div class="food_img">
        <img src=${item.image} />
      </div>
      <div class="food_details">
        <div class="food_name">
          <diV class="d-flex">
            <h5>${item.name}</h5>
            <div class=${item.veg ? "veg" : "non_veg"}>${
        item.veg
          ? `<img src="https://img.icons8.com/color/48/000000/vegetarian-food-symbol.png"/>`
          : `<img src="https://img.icons8.com/fluency/48/000000/non-vegetarian-food-symbol.png"/>`
      }</div>
          </div>
          <span class=${
            !item.bestSeller ? "none" : "best_seller"
          }>Best Seller</span>
          <p><img src="https://img.icons8.com/windows/32/000000/rupee.png"/> ${
            item.price
          }</p>
        </div>
        <div class="food_button">
          <div class="add_button" onclick="addItem('${item._id}')">
            <span class="add_text">ADD</span>
            <i
              class="plus_logo"
              size="12"
              color="#EF4F5F"
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                fill="#EF4F5F"
                width="12"
                height="12"
                viewBox="0 0 20 20"
                aria-labelledby="icon-svg-title- icon-svg-desc-"
                role="img"
                class="sc-rbbb40-0 ezrcri"
              >
                <title>plus</title>
                <path
                  d="M15.5 9.42h-4.5v-4.5c0-0.56-0.44-1-1-1s-1 0.44-1 1v4.5h-4.5c-0.56 0-1 0.44-1 1s0.44 1 1 1h4.5v4.5c0 0.54 0.44 1 1 1s1-0.46 1-1v-4.5h4.5c0.56 0 1-0.46 1-1s-0.44-1-1-1z"
                ></path></svg
            ></i>
          </div>
        </div>
      </div>
    </div>`;
    })
    .join("");
  recommended.insertAdjacentHTML("beforeend", recommendedHTML);
  const pizzaHTML = pizzaArray
    .map((item) => {
      return `<div class="food d-flex my-3">
      <div class="food_img">
        <img src=${item.image} />
      </div>
      <div class="food_details">
        <div class="food_name">
          <diV class="d-flex">
            <h5>${item.name}</h5>
            <div class=${item.veg ? "veg" : "non_veg"}>${
        item.veg
          ? `<img src="https://img.icons8.com/color/48/000000/vegetarian-food-symbol.png"/>`
          : `<img src="https://img.icons8.com/fluency/48/000000/non-vegetarian-food-symbol.png"/>`
      }</div>
          </div>
          <span class=${
            !item.bestSeller ? "none" : "best_seller"
          }>Best Seller</span>
          <p><img src="https://img.icons8.com/windows/32/000000/rupee.png"/> ${
            item.price
          }</p>
        </div>
        <div class="food_button">
          <div class="add_button" onclick="addItem('${item._id}')">
            <span class="add_text">ADD</span>
            <i
              class="plus_logo"
              size="12"
              color="#EF4F5F"
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                fill="#EF4F5F"
                width="12"
                height="12"
                viewBox="0 0 20 20"
                aria-labelledby="icon-svg-title- icon-svg-desc-"
                role="img"
                class="sc-rbbb40-0 ezrcri"
              >
                <title>plus</title>
                <path
                  d="M15.5 9.42h-4.5v-4.5c0-0.56-0.44-1-1-1s-1 0.44-1 1v4.5h-4.5c-0.56 0-1 0.44-1 1s0.44 1 1 1h4.5v4.5c0 0.54 0.44 1 1 1s1-0.46 1-1v-4.5h4.5c0.56 0 1-0.46 1-1s-0.44-1-1-1z"
                ></path></svg
            ></i>
          </div>
        </div>
      </div>
    </div>`;
    })
    .join("");
  pizza.insertAdjacentHTML("beforeend", pizzaHTML);
  const burgerHTML = burgersArray
    .map((item) => {
      return `<div class="food d-flex my-3">
      <div class="food_img">
        <img src=${item.image} />
      </div>
      <div class="food_details">
        <div class="food_name">
          <diV class="d-flex">
            <h5>${item.name}</h5>
            <div class=${item.veg ? "veg" : "non_veg"}>${
        item.veg
          ? `<img src="https://img.icons8.com/color/48/000000/vegetarian-food-symbol.png"/>`
          : `<img src="https://img.icons8.com/fluency/48/000000/non-vegetarian-food-symbol.png"/>`
      }</div>
          </div>
          <span class=${
            !item.bestSeller ? "none" : "best_seller"
          }>Best Seller</span>
          <p><img src="https://img.icons8.com/windows/32/000000/rupee.png"/> ${
            item.price
          }</p>
        </div>
        <div class="food_button">
          <div class="add_button" onclick="addItem('${item._id}')">
            <span class="add_text">ADD</span>
            <i
              class="plus_logo"
              size="12"
              color="#EF4F5F"
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                fill="#EF4F5F"
                width="12"
                height="12"
                viewBox="0 0 20 20"
                aria-labelledby="icon-svg-title- icon-svg-desc-"
                role="img"
                class="sc-rbbb40-0 ezrcri"
              >
                <title>plus</title>
                <path
                  d="M15.5 9.42h-4.5v-4.5c0-0.56-0.44-1-1-1s-1 0.44-1 1v4.5h-4.5c-0.56 0-1 0.44-1 1s0.44 1 1 1h4.5v4.5c0 0.54 0.44 1 1 1s1-0.46 1-1v-4.5h4.5c0.56 0 1-0.46 1-1s-0.44-1-1-1z"
                ></path></svg
            ></i>
          </div>
        </div>
      </div>
    </div>`;
    })
    .join("");
  burger.insertAdjacentHTML("beforeend", burgerHTML);
};

const fetchFood = async () => {
  try {
    const response = await fetch(
      `http://localhost:3000/restaurants/food?${Date.now()}`
    );
    foodData = await response.json();
    addFoodHTML();
  } catch (err) {
    console.log(err);
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
  <img style="height: 13rem; border-radius: 2rem; padding: 1rem; margin-bottom: 2rem" src="${restaurant.image}" />`;
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
  fetchFood();
  for (let link of directionLink) {
    link.href = `https://www.google.com/maps/dir/?api=1&destination=${restaurant.geometry.coordinates[1]},${restaurant.geometry.coordinates[0]}`;
  }
  avgPrice.innerText = restaurant.average_cost_for_two;
  number.innerText = `+91-${restaurant.phone_numbers}`;
  timing.innerText = restaurant.timing;
  loader.classList.add("none");
  afterLoad.classList.remove("none");
  getCookie();
  allCartItems();
});

const addItem = async (id) => {
  if (cartCount == 0) {
    cartTitle.innerText = "Cart";
    displayCartItem.classList.remove("none");
    cartPayment.classList.remove("none");
  }
  let filterCart = cartArray.filter((item) => {
    let idx = item.indexOf("=");
    let _id = item.substring(0, idx);
    return _id == id;
  })[0];
  if (filterCart != undefined) {
    let count = (cartItems.filter((cart) => {
      return cart.id == id;
    })[0].count += 1);
    setCookie(count, id, 0.0006);
  } else {
    const response = await fetch(
      `http://localhost:3000/restaurants/food/${id}?${Date.now()}`
    );
    const cartItem = await response.json();
    const item = {
      id: cartItem.cartItem._id,
      value: cartItem.cartItem,
      count: 1,
    };
    cartArray.push(id + "=1");
    setCookie(1, id, 0.0006);
    cartItems.push(item);
  }
  cartCount += 1;
  displayCartItem.innerText = cartCount == 1 ? "1 Item" : `${cartCount} Items`;
  displayItems();
  console.log(cartArray);
  console.log(cartItems);
};

const removeFromCart = (id) => {
  let count = cartItems.filter((cart) => {
    return cart.id == id;
  })[0].count;
  if (count == 1) {
    setCookie(count - 1, id, 0.000006);
    cartArray = cartArray.filter((item) => {
      let idx = item.indexOf("=");
      let _id = item.substring(0, idx);
      return _id != id;
    });
    cartItems = cartItems.filter((item) => {
      return id != item.value._id;
    });
  } else {
    setCookie(count - 1, id, 0.0006);
    cartItems.filter((item) => {
      return id == item.value._id;
    })[0].count -= 1;
  }
  cartCount -= 1;
  if (cartCount == 0) {
    cartTitle.innerText = "Cart Empty";
    displayCartItem.classList.add("none");
    cartPayment.classList.add("none");
  } else {
    displayCartItem.innerText =
      cartCount == 1 ? "1 Item" : `${cartCount} Items`;
  }
  displayItems();
};

function setCookie(count, id, days) {
  const d = new Date();
  d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
  let expires = "expires=" + d.toUTCString();
  document.cookie = id + "=" + count + ";" + expires + "; ";
}

function getCookie() {
  let cart = document.cookie.split("; ");
  if (cart[0] != "") {
    cartArray = cart;
  }
  console.log(cartArray);
}

async function allCartItems() {
  for (let cart of cartArray) {
    if (cart == "") {
      continue;
    }
    let idx = cart.indexOf("=");
    let id = cart.substring(0, idx);
    const response = await fetch(
      `http://localhost:3000/restaurants/food/${id}?${Date.now()}`
    );
    const cartItem = await response.json();
    const item = {
      id: id,
      value: cartItem.cartItem,
      count: parseInt(cart.substring(idx + 1)),
    };
    cartCount += item.count;
    cartItems.push(item);
  }
  if (cartCount > 0) {
    cartTitle.innerText = "Cart";
    displayCartItem.innerText =
      cartCount == 1 ? "1 Item" : `${cartCount} Items`;
    displayItems();
    displayCartItem.classList.remove("none");
    cartPayment.classList.remove("none");
  } else {
    displayCartItem.classList.add("none");
    cartPayment.classList.add("none");
  }
  console.log(cartItems);
}

function displayItems() {
  cartBody.innerHTML = "";
  const displayCart = cartItems
    .map((item) => {
      return `
    <div class='food-item'>
  <div class='food-body'>
  <div class=${item.value.veg ? "veg" : "non_veg"}>${
        item.value.veg
          ? `<img src="https://img.icons8.com/color/48/000000/vegetarian-food-symbol.png"/>`
          : `<img src="https://img.icons8.com/fluency/48/000000/non-vegetarian-food-symbol.png"/>`
      }</div>
    <div class='food-title'>
      ${item.value.name}
    </div>
  </div>
  <div class='add-food'>
    <div class='food-details'>
      <div class='food-quantity'>
        <div class='food-negative' onclick="removeFromCart('${
          item.value._id
        }')">-</div>
        <div class='food-number'>${item.count}</div>
        <div class='food-positive' onclick="addItem('${
          item.value._id
        }')">+</div>
      </div>
      <div class='food-price'>
        <span class='food-total'>&#8377 ${item.count * item.value.price}</span>
      </div>
    </div>
  </div>
</div>`;
    })
    .join("");
  cartBody.insertAdjacentHTML("beforeend", displayCart);
}
