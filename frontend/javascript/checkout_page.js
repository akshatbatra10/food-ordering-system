const id = window.localStorage.getItem("restaurantID");
const restaurantImage = document.querySelector(".restaurant-image");
const restaurantName = document.querySelector(".restaurant-name");
const restaurantAdd = document.querySelector(".restaurant-address");
const cartBody = document.querySelector(".cart-body");
const disPlayTotalPrice = document.querySelector(".to-pay-price");
const tax = document.querySelector("#tax");
const cartPrice = document.querySelector("#cart-price");
const redirect = document.querySelector("#redirect");
const cartCheckout = document.querySelector(".con");
const cartEmpty = document.querySelector(".empty-cart");

let cartItems = [];
let cartArray = [];
let totalPrice = 0;
let taxAmt = 0;
let restaurant;
let cartCount = 0;

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

function getCart() {
  let cart = document.cookie.split("; ");
  if (cart[0] != "") {
    cartArray = cart;
  }
  allCartItems();
}
const addItem = async (id) => {
  let count = (cartItems.filter((cart) => {
    return cart.id == id;
  })[0].count += 1);
  setCookie(count, id, 0.006);

  cartCount += 1;
  displayItems();
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
    setCookie(count - 1, id, 0.006);
    cartItems.filter((item) => {
      return id == item.value._id;
    })[0].count -= 1;
  }
  cartCount -= 1;
  if (cartCount == 0) {
    cartCheckout.classList.add("none");
    cartEmpty.classList.remove("none");
  }
  displayItems();
};

function setCookie(count, id, days) {
  const d = new Date();
  d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
  let expires = "expires=" + d.toUTCString();
  document.cookie = id + "=" + count + ";" + expires + "; ";
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
    cartCheckout.classList.remove("none");
    cartEmpty.classList.add("none");
  } else {
    cartCheckout.classList.add("none");
    cartEmpty.classList.remove("none");
  }
  displayItems();
  console.log(cartItems);
}

function displayItems() {
  cartBody.innerHTML = "";
  totalPrice = 0;
  const displayCart = cartItems
    .map((item) => {
      totalPrice += item.value.price * item.count;
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
  cartPrice.innerText = totalPrice;
  taxAmt = (0.18 * totalPrice).toFixed(2);
  tax.innerText = taxAmt;
  let total = totalPrice + 48 + parseFloat(taxAmt);
  disPlayTotalPrice.innerHTML = `<span>&#8377</span>${total}`;
}

redirect.addEventListener("click", function () {
  window.location.href = "/restaurants.html";
});

window.addEventListener("load", async function () {
  await fetchData();
  addRestaurant();
  getCart();
});
