const token = window.localStorage.getItem("accesstoken");
const userId = window.localStorage.getItem("id");
const login = document.querySelector("#login_signup");
const logout = document.querySelector("#logout");

const bookmarks = new Set();

if (token != null) {
  login.classList.add("none");
  logout.classList.remove("none");
  getWishList();
  console.log(bookmarks);
} else {
  logout.classList.add("none");
  login.classList.remove("none");
}

logout.addEventListener("click", function () {
  logout.classList.add("none");
  login.classList.remove("none");
  window.localStorage.removeItem("accesstoken");
  window.localStorage.removeItem("id");
});

async function getWishList() {
  const response = await fetch(
    `http://localhost:3000/users/info/${userId}?${Date.now()}`
  );
  const user = await response.json();
  user.bookmarks.map((data) => {
    bookmarks.add(data);
  });
}
