const weatherBlock = document.getElementById("weather_wrapper");

async function loadWeather () {

    const server = 'http://api.openweathermap.org/data/2.5/weather?q=Odesa&units=metric&APPID=5d066958a60d315387d9492393935c19';
    const response = await fetch (server, {
        method: 'GET',
    });

    const responseResult = await response.json();

    if (response.ok) {
        getWeather(responseResult)
    } else {
        weatherBlock.innerHTML = responseResult.message;
    }
}

loadWeather();


function getWeather (data) {

    const location = data.name;
    const temp =Math.round(data.main.temp);
    const pressure = data.main.pressure;
    const description = data.weather[0].description;
    const humidity = data.main.humidity;
    const speed = data.wind.speed;
    const deg = data.wind.deg;
    const icon = data.weather[0].icon;

    let tamplate = `
    <div class="weather_header">
        <div class="weather_main">
            <div class="weather city">Місто: ${location}</div>
            <div class="weather temp">Температура: ${temp}</div>
        </div>
        
        <div class="weather_icon">
            <img class="icon" src="http://openweathermap.org/img/w/${icon}.png" alt="Clouds">
        </div>
       
        <div class="weather_block">
            <div class="weather pressure">Тиск: ${pressure}</div>
            <div class="weather description">Опис: ${description}</div>
            <div class="weather humidity">Вологість: ${humidity}</div>
            <div class="weather speed">Швидкість вітру: ${speed}</div>
            <div class="weather deg">Напрям у градусах: ${deg}</div>
        </div>        
    </div>
    `
    
    weatherBlock.innerHTML= tamplate;
};