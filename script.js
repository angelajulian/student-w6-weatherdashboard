let cityList = [];
let cityname = "";

const saveCityList = function () {
  localStorage.setItem("cities", JSON.stringify(cityList));
};

const loadCityList = function () {
  let cityList = JSON.parse(localStorage.getItem("cities"));
};

const getCityWeather = function (city) {};

$("#searchForm").submit(function (event) {
  alert("worked");
  event.preventDefault();
});
