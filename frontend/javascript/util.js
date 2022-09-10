const token = window.localStorage.getItem("accesstoken");
const login = document.querySelector("#login_signup");
const logout = document.querySelector("#logout");

let wishlist = [];

if (token != null) {
  login.classList.add("none");
  logout.classList.remove("none");
} else {
  logout.classList.add("none");
  login.classList.remove("none");
}

logout.addEventListener("click", function () {
  logout.classList.add("none");
  login.classList.remove("none");
  window.localStorage.removeItem("accesstoken");
});

// async function getWishList() {
//   const response = await
// }
