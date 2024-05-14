document.addEventListener("DOMContentLoaded", function() {
    const menuBtn = document.querySelector(".menubtn");
    const dropdownContent = document.querySelector("#nav");

    menuBtn.addEventListener("click", function() {
        dropdownContent.classList.toggle("hidden2");
    
        
     
    });
});

const weatherCard = document.querySelector('#weather-cards');
const apiKey = "6df3f95fbc9eb9deb9e6dac8d39a5a9c";
const url = "https://api.openweathermap.org/data/2.5/weather?&q=";
const apiKey2 = "9957M3C3FPWSHP785ZAY28AX6";
const url2 = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/";
const searchCity = document.querySelector('#search-city');
const searchBtn = document.querySelector('#text');
const weatherIcon = document.querySelector('#weather-inner');
const farenheitbtn = document.querySelector('#farenheit');
const celciusBtn = document.querySelector('#celcius\\ active');
const weekBtn = document.querySelector('#week\\ active');

let hourlyorWeek = "Week";

async function checkAPI(city, units='metric'){
    try{
const api = await fetch(url + city + `&units=${units}&appid=${apiKey}`);
const data = await api.json();
console.log(data);

    return data;
    }catch(error){
        console.error('Error fetching data:', error);
        throw error;
    }

}

async function checkAPI2(city, units = 'metric') {
    try {
        const response = await fetch(`${url2}${city}?unitGroup=${units}&key=${apiKey2}`);
        if(!response.ok){
            alert('location not found' + '\n Provide more detais EX.(City, Country)');
        }
        const data = await response.json();
        console.log(data);
    
            return data;
    }catch (error) {
        console.error('Error fetching weather data:', error);
        throw error; 
    }
}

//To update the UI according to the API
function updateUI(data, data2, hourlyorWeek, unit) {
    document.querySelector('.location').innerHTML = `${data.name} , ${data.sys.country}`;
    document.querySelector('#temp2').innerHTML = Math.round(data.main.temp);
    document.querySelector('#humidity').innerHTML = `${data.main.humidity}%`;
    document.querySelector('#wind-speed').innerHTML = data.wind.speed;
    document.querySelector('#visibility').innerHTML = data2.currentConditions.visibility;
    document.querySelector('#visibility-status').innerHTML = visibilityLevel(data2.currentConditions.visibility);
    document.querySelector('#cond').innerHTML = data.weather[0].main;
    const iconSrc = setWeatherIcon(data.weather[0].main);
    weatherIcon.src = iconSrc;
    document.querySelector('#date-time').innerHTML =  `${formatDateTime(data2.currentConditions.datetimeEpoch, 0)}${data2.currentConditions.datetime}`;
    document.querySelector('#air-quality').innerHTML = data.wind.deg;
    document.querySelector('#air-status').innerHTML = airQualityLevel(data.wind.deg);
    document.querySelector('#sunrise').innerHTML = onlyTime(data2.currentConditions.sunrise);
    document.querySelector('#sunset').innerHTML = onlyTime(data2.currentConditions.sunset);
    document.querySelector('#uv-index').innerHTML = data2.currentConditions.uvindex;
    document.querySelector('#uv-text').innerHTML = uVIndexLevel(data2.currentConditions.uvindex);
    document.querySelector('#humidity-status').innerHTML = setHumidityStatus(data.main.humidity);

    if(hourlyorWeek === "hourly"){
        updateForecast(data2.days[0].hours, "hourly", unit, data2.icons);
    }else{
        updateForecast(data2.days, "week" , data2.icons, unit);
    }
}


// Update forecast
function updateForecast(data2, type, icons, unit) { 
    document.querySelector('#weather-cards').innerHTML = "";
    let day = 1;
    const numCards = (type == "day")? 24 : 7;


    for (let i = 0; i < numCards; i++) {
        let card = document.createElement("div");
        card.classList.add("card");
        const dayName = (type === "week") ? getDayName(data2[day].datetime) : getHour(data2[day].datetime);
        let dayTemp = data2[day].temp;
        let icon = data2[day].icon;
        let iconSrc = setWeatherIcon2(icon);
        card.innerHTML = `
            <h2 class="font-semibold text-sm"id="day-name">${dayName}</h2>
            <div class="w-3/4 margin"  id="card-icon">
                <img src="${iconSrc}" width="100%" alt="${iconSrc}" />    
            </div>
            <div class="text-xl font-semibold text-gray-400 flex items-center justify-center" id="day-temp">
                <h2 class="temp">${Math.round(dayTemp.toFixed(1))}</h2>
                <span class="temp-unit">${unit === "imperial" ? "℉" : "℃"}</span>
            </div>
        `;
        weatherCard.appendChild(card);
        day++;
    }
}

    
    

function getHour(hour){
    let time = hour.split(":")[0];
    let min = hour.split(":")[1];
    if(time = 12){
        time = time - 12;
        return `${time}:${min} PM`;
    }
    else{
        return `${time}:${min} AM`;
    }
    

}

function getDayName(date){
    let day = new Date(date);
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[day.getDay()];
}



function uVIndexLevel(uvIndex) {
    if (uvIndex < 3) {
        return "Low";
    } else if (uvIndex >= 3 && uvIndex < 6) {
        return "Moderate";
    } else {
        return "High";
    }
}

// Geolocation function to get user's current location
function getGeolocation() {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        } else {
            reject(new Error('Geolocation is not supported by this browser.'));
        }
    });
}




// Function to fetch weather data based on user's current location
async function fetchWeatherDataByGeolocation() {
    try {
        const position = await getGeolocation();
        const { latitude, longitude } = position.coords;
        const city = await fetchCityByCoordinates(latitude, longitude);
        await weatherData(city);
    } catch (error) {
        console.error('Error fetching weather data by geolocation:', error);
    }
}


const locationBtn = document.querySelector("#location-btn");
locationBtn.addEventListener("click", fetchWeatherDataByGeolocation);


async function fetchCityByCoordinates(latitude, longitude) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`);
        const data = await response.json();
        return data.name;
    } catch (error) {
        console.error('Error fetching city name by coordinates:', error);
        throw error;
    }
}



//to check air quality
function airQualityLevel(aqi) {
    if (aqi < 51) {
        return "Good";
    } else if (aqi < 101) {
        return "Moderate";
    } else if (aqi < 151) {
        return "Bad";
    } else {
        return "Very Bad";
    }
}


// Function to set weather icon based on weather condition
function setWeatherIcon(weatherCondition) {
    switch (weatherCondition) {
        case 'Rain':
            return "icon/rain.gif";
        case 'Clear':
            return "icon/sunny.gif";
        case 'Clouds':
            return "icon/cloudy.gif";
        case 'Haze':
            return "icon/hazy.png";
        case 'Mist':
            return "icon/Mist.png";
        default:
            return "icon/sunny.gif";
            
    }
}


function setWeatherIcon2(weatherCondition) {
    switch (weatherCondition) {
        case 'rain':
            return "icon/rain.gif";
        case 'Clear':
            return "icon/sunny.gif";
        case 'partly-cloudy-day':
            return "icon/cloudy.gif";
        case 'Haze':
            return "icon/hazy.png";
        case 'Mist':
            return "icon/Mist.png";
        default:
            return "icon/sunny.gif";
            
    }
}



// Function to set humidity status
function setHumidityStatus(humidity) {
    if (humidity < 30) {
        return "Low";
    } else if (humidity >= 30 && humidity <= 60) {
        return "Moderate";
    } else {
        return "High";
    }
}


//Function to set date and time
function formatDateTime() {
    let date = new Date();
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    let dayIndex  = date.getDay();
    var dayString = days[dayIndex];
    return dayString +', ';
}


function onlyTime(time) {
let hour  = time.split(":")[0];
let minute = time.split(":")[1];
let amPm = hour >= 12 ? "pm" : "am";
hour = hour ? hour : 12;
hour = hour < 10 ? hour : hour;
minute = minute < 10 ?  minute : minute;
let strTime = hour + ":" + minute + amPm;
return strTime;
}

//check visibility level
function visibilityLevel(visibility) {
    if (visibility < 1) {
        return "Dense Fog";
    } else if (visibility >= 1 && visibility < 5) {
        return "Low visibility";
    } else if (visibility >= 5 && visibility < 10) {
        return "Moderate visibility";
    } else if (visibility >= 10 && visibility < 20) {
        return "High Visibility";
    } else {
        return "Very High fog";
    }
}




// Main function to check API and update UI
async function weatherData(city){
    try {
        const data = await checkAPI(city);
        const data2 = await checkAPI2(city);
            // Update the UI with the weather data
            updateUI(data, data2);
        
    } catch (error) {
        console.error("Error fetching or updating weather data:", error);
    }
}

//After clicking the button
//After clicking the button
searchBtn.addEventListener('click', (event) => {
    event.preventDefault();
    const city = searchCity.value.trim(); // Get the value of the city and remove leading/trailing whitespaces
    if (city) {
        // Fetch weather data for the searched city
        weatherData(city);

        // Retrieve the list of searched cities from local storage or initialize an empty array
        let searchedCities = JSON.parse(localStorage.getItem('searchedCities')) || [];

        // Add the new city to the array if it's not already present
        if (!searchedCities.includes(city)) {
            searchedCities.push(city);
        }

        // Save the updated array back to local storage
        localStorage.setItem('searchedCities', JSON.stringify(searchedCities));

        // Display the list of searched cities in the dropdown menu
        displaySearchedCities(searchedCities);
    } else {
        alert('Please enter a valid city name.');
    }
});


function displaySearchedCities(searchedCities) {
    const dropdown = document.querySelector('#city-dropdown');

    // Create list items for each searched city
    searchedCities.forEach(city => {
        const listItem = document.createElement('option');
        listItem.textContent = city;
        dropdown.appendChild(listItem);
    });
}
const dropdown = document.querySelector('#city-dropdown');
dropdown.addEventListener('change', function() {

    // Set the value of the search input to the selected option's value

    searchCity.value = dropdown.value;
    dropdown.value = '';
  });


