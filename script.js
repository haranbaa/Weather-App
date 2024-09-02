// WEATHER APP

const weatherForm = document.querySelector(".weatherForm");
const cityInput = document.querySelector(".cityInput");
const forecastContainer = document.querySelector(".forecast-container");
const apiKey = "c3ce0f001cad8c9601c09cca4c838aab";

weatherForm.addEventListener("submit", async event => {
    event.preventDefault();

    const city = cityInput.value;

    if (city) {
        try {
            const weatherData = await getWeatherData(city);
            displayWeatherInfo(weatherData);
        } catch (error) {
            console.error(error);
            displayError(error);
        }
    } else {
        displayError("Please enter a city");
    }
});

async function getWeatherData(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;
    const response = await fetch(apiUrl);

    if (!response.ok) {
        throw new Error("Could not fetch weather data");
    }

    return await response.json();
}

function displayWeatherInfo(data) {
    forecastContainer.style.display = 'flex';
    forecastContainer.innerHTML = ""; 

    const dailyForecasts = {};

   
    data.list.forEach(item => {
        const date = item.dt_txt.split(" ")[0];
        if (!dailyForecasts[date]) {
            dailyForecasts[date] = [];
        }
        dailyForecasts[date].push(item);
    });

 
    Object.keys(dailyForecasts).slice(0, 5).forEach(date => {
        const dailyData = dailyForecasts[date][0]; 
        
        const card = document.createElement("div");
        card.classList.add("card");
        
        const dateDisplay = document.createElement("h2");
        const tempDisplay = document.createElement("p");
        const descDisplay = document.createElement("p");
        const weatherEmoji = document.createElement("p");

        const temp = dailyData.main.temp;
        const description = dailyData.weather[0].description;
        const id = dailyData.weather[0].id;

        dateDisplay.textContent = new Date(date).toLocaleDateString('en-US', { weekday: 'long' });
        tempDisplay.textContent = `${(temp - 273.15).toFixed(1)}°C`;
        descDisplay.textContent = description;
        weatherEmoji.textContent = getWeatherEmoji(id);

        tempDisplay.classList.add("tempDisplay");
        descDisplay.classList.add("descDisplay");
        weatherEmoji.classList.add("weatherEmoji");

        card.appendChild(dateDisplay);
        card.appendChild(tempDisplay);
        card.appendChild(descDisplay);
        card.appendChild(weatherEmoji);

        forecastContainer.appendChild(card);
    });
}

function getWeatherEmoji(weatherId) {
    switch (true) {
        case (weatherId >= 200 && weatherId < 300):
            return "⛈️"; 
        case (weatherId >= 300 && weatherId < 400):
            return "🌧️"; 
        case (weatherId >= 500 && weatherId < 600):
            return "🌧️"; 
        case (weatherId >= 600 && weatherId < 700):
            return "❄️"; 
        case (weatherId >= 700 && weatherId < 800):
            return "🌫️"; 
        case (weatherId === 800):
            return "☀️"; 
        case (weatherId >= 801 && weatherId < 810):
            return "🌤️"; 
        default:
            return "❓"; 
    }
}

function displayError(message) {
    const errorDisplay = document.createElement("p");
    errorDisplay.textContent = message;
    errorDisplay.classList.add("errorDisplay");

    forecastContainer.innerHTML = "";
    forecastContainer.style.display = "flex";
    forecastContainer.appendChild(errorDisplay);
}
