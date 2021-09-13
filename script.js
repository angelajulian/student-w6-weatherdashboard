let cityList = [];
let newCity = "";

const saveCityList = function () {
  localStorage.setItem("cities", JSON.stringify(cityList));
};

const loadCityList = function () {
  let cities = JSON.parse(localStorage.getItem("cities"));
  if (cities) {
    cityList = cities;
  }

  $("#cityList").empty();
  $("#cityInput").val("");

  for (i = 0; i < cityList.length; i++) {
    var a = $("<a>");
    a.addClass(
      "list-group-item list-group-item-action list-group-item-primary city"
    );
    a.attr("data-name", cityList[i]);
    a.text(cityList[i]);
    $("#cityList").prepend(a);
  }
};

loadCityList();

// get today's weather
const todaysWeather = async function (city) {
  const queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${newCity}&units=imperial&appid=b62a88d0ee1e89cce230d360b62b34d9`;

  const response = await $.ajax({
    url: queryURL,
    method: "GET",
  });
  //   console.log(response);

  let currentWeatherDiv = $("<div class='card-body' id='currentWeather'>");
  const getCurrentCity = response.name;
  const date = new Date();
  const val = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  const getCurrentWeatherIcon = response.weather[0].icon;
  const displayCurrentWeatherIcon = $(
    `<img src = http://openweathermap.org/img/wn/${getCurrentWeatherIcon}@2x.png />`
  );
  let currentCityEl = $("<h3 class = 'card-body'>").text(
    getCurrentCity + `(${val})`
  );
  currentCityEl.append(displayCurrentWeatherIcon);
  currentWeatherDiv.append(currentCityEl);
  const getTemp = response.main.temp.toFixed(1);
  const tempEl = $("<p class='card-text'>").text(`Temperature: ${getTemp}° F`);
  currentWeatherDiv.append(tempEl);

  const getHumidity = response.main.humidity;
  const humidityEl = $("<p class='card-text'>").text(
    `Humidity: ${getHumidity}%`
  );
  currentWeatherDiv.append(humidityEl);

  const getWindSpeed = response.wind.speed.toFixed(1);
  const windSpeedEl = $("<p class='card-text'>").text(
    `Wind Speed: ${getWindSpeed} mph`
  );
  currentWeatherDiv.append(windSpeedEl);

  const getLong = response.coord.lon;
  const getLat = response.coord.lat;
  const uvURL = `https://api.openweathermap.org/data/2.5/uvi?appid=b62a88d0ee1e89cce230d360b62b34d9&lat=${getLat}&lon=${getLong}`;
  const uvResponse = await $.ajax({
    url: uvURL,
    method: "GET",
  });
  const getUVIndex = uvResponse.value;
  let uvNumber = $("<span>");
  if (getUVIndex > 0 && getUVIndex <= 2.99) {
    uvNumber.addClass("low");
  } else if (getUVIndex >= 3 && getUVIndex <= 5.99) {
    uvNumber.addClass("moderate");
  } else {
    uvNumber.addClass("high");
  }
  uvNumber.text(getUVIndex);
  let uvIndexEl = $("<p class='card-text'>").text("UV Index: ");
  uvNumber.appendTo(uvIndexEl);
  currentWeatherDiv.append(uvIndexEl);
  $("#todayContainer").html(currentWeatherDiv);
};
// get weather forcast
const getCityWeatherForcast = async function () {
  if ($("#forecastContainer").children()) {
    $("#forecastContainer").empty();
  }
  let getRequestURL = `https://api.openweathermap.org/data/2.5/forecast?q=${newCity}&units=imperial&appid=b62a88d0ee1e89cce230d360b62b34d9`;

  let response = await $.ajax({
    url: getRequestURL,
    method: "GET",
  });

  if (response) {
    console.log(response);

    let forecastDiv = $("<div  id='fiveDayForecast'>");
    let forecastHeader = $("<h5 class='card-header border-secondary'>").text(
      "5 Day Forecast"
    );
    forecastDiv.append(forecastHeader);
    let cardDeck = $("<div  class='card-deck'>");
    forecastDiv.append(cardDeck);

    //   console.log(response);
    for (i = 0; i < 5; i++) {
      let forecastCard = $("<div class='card mb-3 mt-3'>");
      let cardBody = $("<div class='card-body'>");
      const date = new Date();
      const val = `${date.getDate()}/${
        date.getMonth() + 1
      }/${date.getFullYear()}`;
      const forecastDate = $("<h5 class='card-title'>").text(val);
      cardBody.append(forecastDate);
      const getCurrentWeatherIcon = response.list[i].weather[0].icon;
      const displayWeatherIcon = $(
        `<img src = http://openweathermap.org/img/wn/${getCurrentWeatherIcon}@2x.png />`
      );
      cardBody.append(displayWeatherIcon);
      const getTemp = response.list[i].main.temp;
      const tempEl = $("<p class='card-text'>").text(`Temp: ${getTemp}° F`);
      cardBody.append(tempEl);
      const getHumidity = response.list[i].main.humidity;
      const humidityEl = $("<p class='card-text'>").text(
        `Humidity: ${getHumidity}%`
      );
      cardBody.append(humidityEl);
      forecastCard.append(cardBody);
      cardDeck.append(forecastCard);
    }
    $("#forecastContainer").append(forecastDiv);
  } else {
      alert(`${newCity} cannot be`)
  }
};

// search handler
$("#submit").on("click", function (event) {
  event.preventDefault();
  newCity = $("#search").val().trim();
  //   console.log(newCity);
  todaysWeather();
  getCityWeatherForcast();

  if (newCity && !cityList.includes(newCity)) {
    cityList.push(newCity);
    console.log("adfadf afd");
  }
  saveCityList();
  loadCityList();
});

// I could not get .on('submit') to work so now this
$("#search").on("keypress", function (event) {
  if (event.which === 13) {
    $("#submit").click();
  }
});

$(document).on("click", ".city", function () {
  newCity = $(this).attr("data-name");
  todaysWeather();
  getCityWeatherForcast();
});
