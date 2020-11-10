// the button will take all the imput elements, and store them into local storage.
$(".submitBtn").on("click", function (event) {
  event.preventDefault();
  var restaurantName = document.getElementById("restaurantName").value;
  var cuisine = document.getElementById("cuisine").value;
  var zipcode = document.getElementById("zipcode").value;
  var carryout = document.getElementById("carryout").checked;

  localStorage.setItem("restaurantName", restaurantName);
  localStorage.setItem("cuisine", cuisine);
  localStorage.setItem("zipcode", zipcode);
  localStorage.setItem("carryout", carryout);
  location.reload();
});

$(".resetBtn").on("click", function () {
  localStorage.clear();
  location.reload();
});
