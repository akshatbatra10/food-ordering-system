const id = window.localStorage.getItem("restaurantID");
console.log(id);
const displayData = document.querySelector("#display");

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
      <span>(250) reviews</span>
    </div>
    <span class="timing">Timing: 11AM - 12AM</span>
  </div>
  <img style="height: 13rem; border-radius: 2rem; padding: 1rem" src="${restaurant.image}" />`;
  displayData.insertAdjacentHTML("beforeend", html);
};

window.addEventListener("load", async function () {
  await fetchData();
  addHTML();
});
