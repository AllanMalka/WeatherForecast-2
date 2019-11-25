let apikey = ""; //Remember to get an api key from https://openweathermap.org/
let geoloc = { lat: 0, lon: 0};
$.getJSON('data/default.json', json => {
    apikey = json.apikey;
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            geoloc.lat = position.coords.latitude;
            geoloc.lon = position.coords.longitude;
            currweather(json.units, geoloc, true);
        }, error => {
            if(error.code == error.PERMISSION_DENIED){
                currweather(json.units, json.location);
            }
        }, {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
          });
    }

}).fail(function () {
    currweather("metrics", "aalborg,dk");
    console.log('no json file found');
});

console.log("Look at the page for the weater!");

const weatherView = (weather) => {
    $('#placeName').text(weather.name);
    var date = new Date(weather.dt * 1000);
    
    $('#currentWeather').text(`Checked at ${date.getHours()}:${date.getMinutes()}.`);
    weather.weather.map(res => {
        $('#weatherIcon').attr('src', `http://openweathermap.org/img/w/${res.icon}.png`);
    });
}

const currweather = (units, loc, direct = false) => {
    const place = direct ? `lat=${loc.lat}&lon=${loc.lon}` : `q=${loc}`;
    let apistring = `http://api.openweathermap.org/data/2.5/weather?${place}&units=${units}&APPID=${apikey}`;
    const data = getWeather(apistring);
    data.then(weather => {
        $('#weatherWrapper').append(`<a href="${apistring}" target="_blank">go to json</a>`)
        weatherView(weather);
    });
}

const setlocation = (position) => {
    geoloc.lat = position.coords.latitude;
    geoloc.lon = position.coords.longitude;
}


async function getWeather(url) {
    const resp = await fetch(url);
    return await resp.json();
}