
const API_KEY = "b61212232f1b42ed168991f5df9ca8e6";
const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const weatherDescription = document.getElementById("weatherDescription");
const weatherIcon = document.getElementById("weatherIcon");
const errorMessage = document.getElementById("errorMessage");
async function getWeather(city) {
    if (city.trim() === "") {
        errorMessage.textContent = "Please enter a city name!";
        return;
    }

    try {
        errorMessage.textContent = "";
        searchBtn.disabled = true;
const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)},IN&appid=${API_KEY}&units=metric`;
        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "City not found!");
        }

        cityName.textContent = data.name;
        temperature.textContent = `${Math.round(data.main.temp)}°C`;
        weatherDescription.textContent = data.weather[0].description;

        weatherIcon.className =
            `fa-solid ${getWeatherIcon(data.weather[0].main)} text-yellow-300`;

    } catch (error) {
        errorMessage.textContent = error.message;
    } finally {
        searchBtn.disabled = false;
    }
}
function getWeatherIcon(condition) {
    const hour=new Date().getHours();
    const isNight = hour >= 19 || hour < 6
    if(condition.toLowerCase()=="clear"){
        return isNight ? "fa-moon" : "fa-sun";
    }
    const icons = {
        "clouds": isNight ? "fa-cloud-moon" : "fa-cloud",
        "cloudy": isNight ? "fa-cloud-moon" : "fa-cloud",
        Clear: "fa-sun",
        Clouds: "fa-cloud",
        Rain: "fa-cloud-rain",
        Drizzle: "fa-cloud-rain",
        Thunderstorm: "fa-bolt",
        Snow: "fa-snowflake",
        Mist: "fa-smog",
        Haze: "fa-smog",
        Fog: "fa-smog"
    };

    return icons[condition] || "fa-cloud-sun";
}
searchBtn.addEventListener("click", () => {
    getWeather(cityInput.value);
});
cityInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        getWeather(cityInput.value);
    }
});