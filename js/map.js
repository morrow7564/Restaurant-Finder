var map;
function initMap() {
  var Cleveland = { lat: 41.4993, lng: -81.6944 };
  map = new google.maps.Map(document.getElementById("map"), { zoom: 8, center: Cleveland });
}
