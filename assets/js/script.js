var submitBtn = document.getElementById("submitBtn");
var searchLimit = 5;
var apiKey = "b788fd9d5af3a791fc64b3d1883a4f5c";
var historyArr = JSON.parse(localStorage.getItem("history")) || [];
var historyDiv = document.getElementById("search-history");

submitBtn.addEventListener("click", function (event) {
  event.preventDefault();
  var cityInput = document.getElementById("city").value;
  //call function
  currentWeather(cityInput);
});

var currentWeather = function (cityInput) {
  //If city doesn't exist in history Array
  if (historyArr.indexOf(cityInput) == -1) {
    historyArr.push(cityInput);
    localStorage.setItem("history", JSON.stringify(historyArr));
    displayHistory();
  }

  var getCity =
    "http://api.openweathermap.org/geo/1.0/direct?q=" +
    cityInput +
    "&limit=" +
    searchLimit +
    "&appid=" +
    apiKey;

  // geocode url "http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}"

  fetch(getCity).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        console.log(data[0]);
        var lat = data[0].lat;
        var lon = data[0].lon;
        getWeather(lat, lon);
      });
    } else {
      window.alert("Search was Unsuccessful");
    }
  });
};

var getWeather = function (lat, lon) {
  var getWeatherUrl =
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
    lat +
    "&lon=" +
    lon +
    "&units=imperial&appid=" +
    apiKey;

  fetch(getWeatherUrl).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        console.log(data);
        display5DayForecast(data.daily);
      });
    } else {
      window.alert("Search was Unsuccessful");
    }
  });
};

var display5DayForecast = function (forecast) {
  var weatherEl = document.getElementById("weather-container");
  weatherEl.innerHTML = '';
  for (var i = 0; i < 5; i++) {
    console.log(forecast);
    //var dateEl = new Date(forecast[i].dt * 1000);

    var dateString = moment.unix(forecast[i].dt).format("MM/DD/YYYY");

    var DayEl = document.createElement("div");
    weatherEl.appendChild(DayEl);
    var header = document.createElement("h4");
    DayEl.appendChild(header);
    header.innerText = dateString;
    var paragraph = document.createElement("p");
    DayEl.appendChild(paragraph);
    paragraph.innerText = "min: " + forecast[i].temp.min + "F";
    var paragraphMax = document.createElement("p");
    DayEl.appendChild(paragraphMax);
    paragraphMax.innerText = "max: " + forecast[i].temp.max + " F";
    DayEl.setAttribute("class", "border-black");
    var iconEl = document.createElement('img');
    iconEl.setAttribute('src', 'http://openweathermap.org/img/wn/' + forecast[i].weather[0].icon + '.png');
    DayEl.appendChild(iconEl);
    var uviEl = document.createElement('p');
    DayEl.appendChild(uviEl);
    uviEl.innerText = 'uvi: ' + forecast[i].uvi;
    var uviColor = 'purple';
    if (forecast[i].uvi < 3) {
      uviColor = "green";
  } else if (forecast[i].uvi < 6) {
      uviColor = "yellow";
  } else if (forecast[i].uvi < 8) {
      uviColor = "orange";
  } else if (forecast[i].uvi < 11) {
      uviColor = "red";
  }
  uviEl.setAttribute('style', 'background-color:' + uviColor);
  }
};

var displayHistory = function () {
  historyDiv.innerText = "";
  for (var i = 0; i < historyArr.length; i++) {
    var btn = document.createElement("button");
    btn.innerText = historyArr[i];
    historyDiv.appendChild(btn);
    btn.setAttribute('class', 'btn');
    //create click event
    btn.addEventListener('click', function()   {
      currentWeather(this.innerText);
    //call function to display forecast
    //currentweather(pass city here)
    });
    
  }
};


displayHistory();
