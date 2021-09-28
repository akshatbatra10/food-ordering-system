const coordinates = window.localStorage.getItem("coordinates");
const lat = JSON.parse(coordinates).lat;
const long = JSON.parse(coordinates).long;

window.onload = async function () {
  console.log("Started");
  const response = await fetch(
    `http://localhost:3000/restaurants?lat=${lat}&long=${long}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
  );
  console.log(response);
};
