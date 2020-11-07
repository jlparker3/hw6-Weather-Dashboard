/* PSEUDO CODE

user can input a city into the search form 
    will save users input to local storage 
    will keep displaying all of users inputs underneath search using prepend

Using OpenWeather API key
    will display weather results based upon the users input in the (weather container) including:
        city (date) weather icon in a heading 
        Temperature
        Humidity
        Wind Speed
        UV Index 
     
    5-day Forecast
        will display cards for each day with the following information:
            date 11/1/2020
            weather icon (sun, clouds, rain, snow)
            Temp
            Humidity
*/



//Global Variables
var api = "b26f77a0f941976c50cef7bdb9d7f15d"
var CityList = [];
var cityName;

//Inital function to display users city input 
function renderCity() {
    $("#cityList").empty();
    $("#citySearch").val("");


    for (i = 0; i < CityList.length; i++) {
        var c = $("<a>");
        c.addClass("list-group");
        c.attr("data-name", CityList[i]);
        c.text("#cityList").prepend(c);


    }
}

//onclick on the search icon button 
$("#citySearchBtn").on("click", function (event) {
    event.preventDefault();

    cityName = $("#citySearch").val()
    CityList.push(cityName);

    saveCityLocally();
    storeCityArray();
    renderCity();
    displayWeather();
    displayForecast();


});


//LOCAL STORAGE
//pulls the array list from local storage 
function startCityList() {
    var savedCities = JSON.parse(localStorage.getItem("cities"));

    renderCity();
}


//save user's city into local storage
function saveCityLocally() {
    localStorage.setItem("currentCity", JSON.stringify(cityName));
}

//save city array into local storage
function storeCityArray() {
    localStorage.setItem("currentCity", JSON.stringify(CityList));
}




//WEATHER
//pulls the current city so the weather will load on page refresh
function startWeather() {
    var storedWeather = JSON.parse(localStorage.getItem("currentCity"));

    displayWeather();
    displayForecast();
}




//ajax call to retrieve data from OpenWeather
function displayWeather() {
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial" + "&appid=" + api;

    var response = $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log(response);
        //var to attrieve from openweather for the main display weather and append it to the page


        //displaying date (THIS DOES NOT WORK)
        // var currentDay = moment().format("MMMM Do, YYYY");
        // // $("#weatherContainer").text("Today's Date: " + currentDay);
       


        //displaying Temperature information
        var getTemp = response.main.temp.toFixed(0);
        var TempEl = $("<p>").text("Temperature:  " + getTemp + "° F");

        //displaying Humidity information
        var getHumidity = response.main.humidity;
        var humidityEL = $("<p>").text("Humidity:  " + getHumidity + "%");


        //displaying windspeed information
        var getWindSpeed = response.wind.speed.toFixed(0);
        var WindSpeedEl = $("<p>").text("Wind Speed:  " + getWindSpeed + "mph");



        //appending weather container information to the page
        $("#weatherContainer").append('<h3>' + cityName);
        // $("#weatherContainer").text("Today's Date: " + currentDay);
        $("#weatherContainer").append(TempEl);
        $("#weatherContainer").append(humidityEL);
        $("#weatherContainer").append(WindSpeedEl);

        //displaying uv index information
        queryURL = "http://api.openweathermap.org/data/2.5/uvi?lat=" + response.coord.lat + "&lon=" + response.coord.lon + "&appid=" + api
        $.ajax({
            url: queryURL,
            method: "GET"

        }).then(function (uvResponse) {

            var uvEl = $("<p>").text("UV Index:  " + uvResponse.value);

            //displaying image information
            var iconcode = response.weather[0].icon
            var iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";
            var img = $("<img>").attr("src", iconurl)
            $("#weatherContainer").append(uvEl, img);

        });

    });

}





//display linearly the 5 day forecast in forecast container
function displayForecast() {
    var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&units=imperial&appid=" + api;

    var response = $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (forecastResponse) {

        var days = forecastResponse.list
        for (let i = 0; i < days.length; i++) {
            if (days[i].dt_txt.includes("00:00:00")) {
                console.log(response)
                console.log(days[i])

                //create card 
                dayCards = $("#forecast").append("<div class= 'card'>");
                dayCards.empty();

                // cardBodyDiv = $("<div class='card-body'>");


                var forecastHeader = $("<h4 class='card-header'>").text("5 Day Forecast");
                $("#forecast").append(forecastHeader);

                var cardDeck = $("<div  class='card-deck'>");
                $("#forecast").append(cardDeck);




                //displaying Temperature information
                var getTemp = response.list[i].main.temp.toFixed(0);
                var TempEl = $("<p>").text("Temperature:  " + getTemp + "° F");

                //displaying Humidity information
                var getHumidity = response.main.humidity;
                var humidityEL = $("<p>").text("Humidity:  " + getHumidity + "%");


                //displaying windspeed information
                var getWindSpeed = response.wind.speed.toFixed(0);
                var WindSpeedEl = $("<p>").text("Wind Speed:  " + getWindSpeed + "mph");


                //append it to id="forecast"

                // $("#forecast").append('<p>' + cityName);
                // // $("#weatherContainer").text("Today's Date: " + currentDay);
                $("#forecast").append(TempEl);
                $("#forecast").append(humidityEL);
                $("#forecast").append(WindSpeedEl);


            }


        }



    })
  

}
