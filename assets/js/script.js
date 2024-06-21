
$(document).ready(function () {
  //get weather fuction
  function getWeather(citySearch) {
    fetch("https://api.openweathermap.org/data/2.5/weather?q=" + citySearch + "&appid=36726c2cbd5ebcfdb234d939b060a4a8")
        .then(response => response.json())
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
                });

            title.append(img);
            cardBody.append(title, temp, humid, wind);
            card.append(cardBody);
            $("#today").append(card);
        });
}

    // api blog sugguestions
    // var APIKey = "36726c2cbd5ebcfdb234d939b060a4a8";
    // let citySearch;
    // const queryURL = `http://api.openweathermap.com/data/2.5/forecast?q={citySearch}&appid={APIKey}`;
    
    
  }
  


  //search button feature
  $("#search-button").on("click", function () {
    //get value in input search-value.
    var citySearch = $("#search-value").val();
    //empty input field.
    $("#search-value").val("");
    getWeather(citySearch);
    getForecast(citySearch);
  });
//search button enter key feature. 
$("#search-button").keypress(function (event) {
  var keycode = (event.keyCode ? event.keyCode : event.which);
  if (keycode === 13) {
    getWeather(citySearch);
    getForecast(citySearch);
  }
});
//pull previous searches from local storage
var history = JSON.parse(localStorage.getItem("history")) || [];

//sets history array search to correct length
if (history.length > 0) {
  getWeather(history[history.length - 1]);
}
//makes a row for each element in history array(citySearchs)
for (var i = 0; i < history.length; i++) {
  createRow(history[i]);
}

//puts the searched cities underneath the previous searched city 
function createRow(text) {
  var listItem = $("<li>").addClass("list-group-item").text(text);
  $(".history").append(listItem);
}

//listener for list item on click function
$(".history").on("click", "li", function () {
  getWeather($(this).text());
  getForecast($(this).text());
});



//
});