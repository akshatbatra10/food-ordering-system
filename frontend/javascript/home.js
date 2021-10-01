let locationCoordinates;

navigator.geolocation.getCurrentPosition((position) => {
  locationCoordinates = {
    lat: position.coords.latitude,
    long: position.coords.longitude,
  };
});

var options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0,
};

// function success(pos) {
//   var crd = pos.coords;

//   locationCoordinates = {
//     lat: crd.latitude,
//     long: crd.longitude,
//   };

//   console.log("Your current position is:");
//   console.log(`Latitude : ${crd.latitude}`);
//   console.log(`Longitude: ${crd.longitude}`);
//   console.log(`More or less ${crd.accuracy} meters.`);
// }

// function error(err) {
//   console.warn(`ERROR(${err.code}): ${err.message}`);
// }

function locate() {
  //   navigator.geolocation.getCurrentPosition(success, error, options);
  navigator.geolocation.getCurrentPosition((position) => {
    locationCoordinates = {
      lat: position.coords.latitude,
      long: position.coords.longitude,
    };
    changePlaceholder(position.coords.latitude, position.coords.longitude);
  });
}

async function changePlaceholder(lat, long) {
  const response = await fetch(
    `https://us1.locationiq.com/v1/reverse.php?key=pk.ac7f1895338e6b0b06892b14e6f747de&lat=${lat}&lon=${long}&format=json`
  );
  const res = response.json();
  res.then((data) => {
    document.getElementsByClassName("leaflet-locationiq-input")[0].value =
      data.display_name;
  });
}

document.getElementById("locate").addEventListener("click", async function () {
  locate();
});

document.getElementById("find").addEventListener("click", function () {
  const location = {
    lat: locationCoordinates.lat,
    long: locationCoordinates.long,
  };
  window.localStorage.setItem("coordinates", JSON.stringify(location));
  window.location.href = "/restaurants.html";
});
// Initialize an empty map without layers (invisible map)
var map = L.map("map", {
  center: [28.7041, 77.1025], // Map loads with this location as center
  zoom: 12,
  scrollWheelZoom: true,
  zoomControl: false,
  attributionControl: false,
});
//Geocoder options
var geocoderControlOptions = {
  bounds: false, //To not send viewbox
  markers: false, //To not add markers when we geocoder
  attribution: null, //No need of attribution since we are not using maps
  expanded: true, //The geocoder search box will be initialized in expanded mode
  panToPoint: false, //Since no maps, no need to pan the map to the geocoded-selected location
  params: {
    //Set dedupe parameter to remove duplicate results from Autocomplete
    dedupe: 1,
    countrycodes: "IN,US",
  },
};

var locateControl = L.control.locate().addTo(map);
//Initialize the geocoder
var geocoderControl = new L.control.geocoder(
  "pk.ac7f1895338e6b0b06892b14e6f747de",
  geocoderControlOptions
)
  .addTo(map)
  .on("select", function (e) {
    locationCoordinates = {
      lat: e.latlng.lat,
      long: e.latlng.lng,
    };
    displayLatLon(e.feature.feature.display_name, e.latlng.lat, e.latlng.lng);
  });

//Get the "search-box" div
var searchBoxControl = document.getElementById("search-box");
//Get the geocoder container from the leaflet map
var geocoderContainer = geocoderControl.getContainer();
//Append the geocoder container to the "search-box" div
searchBoxControl.appendChild(geocoderContainer);
// const data = document.getElementsByClassName('leaflet-locationiq-results');

//Displays the geocoding response in the "result" div
function displayLatLon(display_name, lat, lng) {
  var resultString =
    "You have selected " +
    display_name +
    "<br/>Lat: " +
    lat +
    "<br/>Lon: " +
    lng;
  document.getElementById("result").innerHTML = resultString;
}
