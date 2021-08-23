let map = L.map('map', {
    center: [40.7259, -73.9805], // Map loads with this location as center
    zoom: 12,
    scrollWheelZoom: true,
    zoomControl: false,
    attributionControl: false,
});

//Geocoder options
var geocoderControlOptions = {
    bounds: false,          //To not send viewbox
    markers: false,         //To not add markers when we geocoder
    attribution: null,      //No need of attribution since we are not using maps
    expanded: true,         //The geocoder search box will be initialized in expanded mode
    panToPoint: false       //Since no maps, no need to pan the map to the geocoded-selected location
}

//Initialize the geocoder
var geocoderControl = new L.control.geocoder('pk.ac7f1895338e6b0b06892b14e6f747de', geocoderControlOptions).addTo(map).on('select', function (e) {
    displayLatLon(e.feature.feature.display_name, e.latlng.lat, e.latlng.lng);
});

var options = {
    bounds: true,
    position: 'topright',
    expanded: true
  };
  
L.control.geocoder('<your-api-key>', options).addTo(map);