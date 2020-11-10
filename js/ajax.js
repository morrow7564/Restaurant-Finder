// step0: determining latitude and longitude from zipcode
// **this must be run first to get lat and lon**
// pulls zipcode from localstorage
var zipcode = localStorage.getItem("zipcode").trim();

var queryURL1 = "https://maps.googleapis.com/maps/api/geocode/json?address=" + zipcode + "&key=AIzaSyCxsfk5uokgV_Uu1XpzgMO3OAGaElsVqOw";
var queryURL2;
var lat;
var lon;

$.ajax({
  //ZIPCODE TO LAT/LNG
  url: queryURL1,
  method: "GET",
  async: false,
})
  .then(function (response) {
    var formattedAddress = response.results[0].formatted_address;
    lat = response.results[0].geometry.location.lat;
    lon = response.results[0].geometry.location.lng;
    console.log(formattedAddress);

    console.log(lat);
    console.log(lon);

    // dynamically generating a url string
    function URLgen() {
      var restaurantName = localStorage.getItem("restaurantName");
      var cuisine = localStorage.getItem("cuisine");
      var carryout = localStorage.getItem("carryout");
      queryURL2 = "https://developers.zomato.com/api/v2.1/search?";

      if (restaurantName) {
        queryURL2 += "q=" + restaurantName + "&";
      }
      queryURL2 += "count=15&lat=" + lat + "&lon=" + lon + "&radius=24140.2";
      if (cuisine) {
        queryURL2 += "&cuisine=" + cuisine;
      }
      if (carryout === "true") {
        queryURL2 += "&category=Takeaway";
      }
    }
    URLgen();
    console.log(queryURL2);
  })
  .then(function () {
    //FOOD FUNCTIONS
    $.ajax({
      url: queryURL2,
      method: "GET",
      headers: { "user-key": "19a26be38c8982385cd3ead26085c343" },
      async: false,
    })
      .then(function (responseZomato) {
        console.log(responseZomato);
        console.log(responseZomato.restaurants);

        // array to put all the restaurant results
        var restaurantLoc = [];
        var restName;
        var latVal;
        var longVal;
        var address

        // for loop to append each element into an array
        for (var i = 0; i < responseZomato.restaurants.length; i++) {
          restName = responseZomato.restaurants[i].restaurant.name;
          latVal = responseZomato.restaurants[i].restaurant.location.latitude;
          longVal = responseZomato.restaurants[i].restaurant.location.longitude;
          address= responseZomato.restaurants[i].restaurant.location.address;
          var specific = [];
          specific.push(restName, latVal, longVal, address, parseInt(i) + 1);
          restaurantLoc.push(specific);

          console.log(address)
        }
        console.log(restaurantLoc);
      
        // for each array, create a marker with the coordinates of the lat/lng values

        for (let i = 0; i < restaurantLoc.length; i++) {
          var pos = { lat: parseFloat(restaurantLoc[i][1]), lng: parseFloat(restaurantLoc[i][2]) };
          let marker = new google.maps.Marker({
            position: pos,
            map: map,
          });
          let windowContent = restaurantLoc[i][0] + ": " + restaurantLoc[i][3] + ", " ;
          let infoWindow = new google.maps.InfoWindow({
            content: windowContent,
          });
          // each marker will have the respective windowContent in each box
          marker.addListener("click", () => {
            console.log(marker.position.lat());
            infoWindow.open(map, marker);
          });
        }
      })
      .then(function () {
        //WEATHER STUFF FROM HERE ON
        var APIKey = "6cfffd42b643f9cd29fe45722d8c7849";

        // Here we are building the URL we need to query the database
        var queryURL3 = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey;

        // Here we run our AJAX call to the OpenWeatherMap API
        $.ajax({
          url: queryURL3,
          method: "GET",
          async: false,
        })
          // We store all of the retrieved data inside of an object called "response"
          .then(function (responseWeather) {
            // Log the queryURL
            console.log(queryURL3);

            // Log the resulting object
            console.log(responseWeather);

            // Transfer content to HTML
            $(".city").html("<h1>" + responseWeather.name + " Weather Details &#127777;</h1>");
            $(".wind").text("Wind Speed (m/s): " + responseWeather.wind.speed);
            $(".description").text("Weather description: " + responseWeather.weather[0].description);

            // Convert the temp to fahrenheit
            var tempF = (responseWeather.main.temp - 273.15) * 1.8 + 32;
            var feelsF = (responseWeather.main.feels_like - 273.15) * 1.8 + 32;
            // add temp content
            $(".tempF").text("Temperature (F) " + tempF.toFixed(2));
            $(".feelsLike").text("Feels like: " + feelsF.toFixed(2));

            console.log("Temperature (F): " + tempF);
          });
      });
  });
