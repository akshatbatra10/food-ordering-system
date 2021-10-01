const coordinates = window.localStorage.getItem("coordinates");
const lat = JSON.parse(coordinates).lat;
const long = JSON.parse(coordinates).long;

window.addEventListener("load", async function () {
  console.log("Hi");
  try {
    await fetch(`http://localhost:3000/restaurants/?lat=${lat}&long=${long}`, {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((res) => console.log(res));
    // const restaurants = await response.json();
  } catch (e) {
    console.log(e);
  }
});
