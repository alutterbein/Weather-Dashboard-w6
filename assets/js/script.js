$(document).ready(function () {
  // Function to fetch weather data
  function getWeather(citySearch) {
      fetch("https://api.openweathermap.org/data/2.5/weather?q=" + citySearch + "&appid=36726c2cbd5ebcfdb234d939b060a4a8")
          .then(response => {
              if (!response.ok) {
                  throw new Error('Network response was not ok');
              }
              return response.json();
          })
          .then(data => {
              if (history.indexOf(citySearch) === -1) {
                  history.push(citySearch);
                  localStorage.setItem("history", JSON.stringify(history));
                  createRow(citySearch);
              }
              $("#today").empty();

              var title = $("<h3>").addClass("card-title").text(data.name + " (" + new Date().toLocaleDateString() + ")");
              var img = $("<img>").attr("src", "https://openweathermap.org/img/w/" + data.weather[0].icon + ".png");
              var card = $("<div>").addClass("card");
              var cardBody = $("<div>").addClass("card-body");
              var wind = $("<p>").addClass("card-text").text("Wind Speed: " + data.wind.speed + " MPH");
              var humid = $("<p>").addClass("card-text").text("Humidity: " + data.main.humidity + " %");
              var temp = $("<p>").addClass("card-text").text("Temperature: " + data.main.temp + " K");
              var lon = data.coord.lon;
              var lat = data.coord.lat;

              fetch("https://api.openweathermap.org/data/2.5/uvi?appid=36726c2cbd5ebcfdb234d939b060a4a8&lat=" + lat + "&lon=" + lon)
                  .then(response => response.json())
                  .then(uvResponse => {
                      var uvIndex = $("<p>").addClass("card-text").text("UV Index: ");
                      var btn = $("<span>").addClass("btn btn-sm").text(uvResponse.value);

                      if (uvResponse.value < 3) {
                          btn.addClass("btn-success");
                      } else if (uvResponse.value < 7) {
                          btn.addClass("btn-warning");
                      } else {
                          btn.addClass("btn-danger");
                      }

                      cardBody.append(uvIndex.append(btn));
                      $("#today .card-body").append(uvIndex);
                  })
                  .catch(error => console.error('Error fetching UV index:', error));

              title.append(img);
              cardBody.append(title, temp, humid, wind);
              card.append(cardBody);
              $("#today").append(card);
          })
          .catch(error => console.error('Error fetching weather:', error));
  }

  // Function to fetch weather forecast
  function getForecast(citySearch) {
      fetch("https://api.openweathermap.org/data/2.5/forecast?q=" + citySearch + "&appid=36726c2cbd5ebcfdb234d939b060a4a8&units=imperial")
          .then(response => {
              if (!response.ok) {
                  throw new Error('Network response was not ok');
              }
              return response.json();
          })
          .then(data => {
              $("#forecast").html("<h4 class=\"mt-3\">5-Day Forecast:</h4>").append("<div class=\"row\">");

              for (var i = 0; i < data.list.length; i++) {
                  if (data.list[i].dt_txt.indexOf("15:00:00") !== -1) {
                      var titleFive = $("<h3>").addClass("card-title").text(new Date(data.list[i].dt_txt).toLocaleDateString());
                      var imgFive = $("<img>").attr("src", "https://openweathermap.org/img/w/" + data.list[i].weather[0].icon + ".png");
                      var colFive = $("<div>").addClass("col-md-2.5");
                      var cardFive = $("<div>").addClass("card bg-primary text-white");
                      var cardBodyFive = $("<div>").addClass("card-body p-2");
                      var humidFive = $("<p>").addClass("card-text").text("Humidity: " + data.list[i].main.humidity + "%");
                      var tempFive = $("<p>").addClass("card-text").text("Temperature: " + data.list[i].main.temp + " °F");

                      colFive.append(cardFive.append(cardBodyFive.append(titleFive, imgFive, tempFive, humidFive)));
                      $("#forecast .row").append(colFive);
                  }
              }
          })
          .catch(error => console.error('Error fetching forecast:', error));
  }

  // Search button click handler
  $("#search-button").on("click", function () {
      var citySearch = $("#search-value").val().trim();
      if (citySearch !== "") {
          $("#search-value").val("");
          getWeather(citySearch);
          getForecast(citySearch);
      }
  });

  // Search button enter key handler
  $("#search-value").keypress(function (event) {
      var keycode = (event.keyCode ? event.keyCode : event.which);
      if (keycode === 13) {
          var citySearch = $("#search-value").val().trim();
          if (citySearch !== "") {
              $("#search-value").val("");
              getWeather(citySearch);
              getForecast(citySearch);
          }
      }
  });

  // Pull previous searches from local storage
  var history = JSON.parse(localStorage.getItem("history")) || [];

  // Display previous searches
  if (history.length > 0) {
      getWeather(history[history.length - 1]);
  }

  // Create a row for each previous search
  for (var i = 0; i < history.length; i++) {
      createRow(history[i]);
  }

  // Function to create a row in the search history
  function createRow(text) {
      var listItem = $("<li>").addClass("list-group-item").text(text);
      $(".history").append(listItem);
  }

  // Click handler for history items
  $(".history").on("click", "li", function () {
      var citySearch = $(this).text();
      getWeather(citySearch);
      getForecast(citySearch);
  });

});
