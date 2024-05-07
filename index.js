// const temp = document.querySelector('.temp');

const apiKey = "6df3f95fbc9eb9deb9e6dac8d39a5a9c";
const url = "https://api.openweathermap.org/data/2.5/weather?&q=";
const apiKey2 = "9957M3C3FPWSHP785ZAY28AX6";
const url2 = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/";
const searchCity = document.querySelector('#search-city');
const searchBtn = document.querySelector('#text');
const weatherIcon = document.querySelector('#weather-inner');
const farenheitbtn = document.querySelector('#farenheit');
const celciusBtn = document.querySelector('#celcius\\ active');

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

async function checkAPI2(city, unit, hourlyorweek) {
    try {
        const response = await fetch(`${url2}${city}?unitGroup=metric&key=${apiKey2}`);
        const data = await response.json();
        console.log(data);
        return data;
    }catch (error) {
        console.error('Error fetching weather data:', error);
        throw error; 
    }
}

//To update the UI according to the API
function updateUI(data, data2) {
    document.querySelector('.location').innerHTML = data.name + ', ' + data.sys.country;
    document.querySelector('.temp').innerHTML = Math.round(data.main.temp);
    document.querySelector('#temp2').innerHTML = Math.round(data.main.temp);
    document.querySelector('#humidity').innerHTML = data.main.humidity + "%";
    document.querySelector('#wind-speed').innerHTML = data.wind.speed;
    document.querySelector('#visibility').innerHTML = data2.currentConditions.visibility;
    document.querySelector('#cond').innerHTML = data.weather[0].main;
    setWeatherIcon(data.weather[0].main);
    document.querySelector('#date-time').innerHTML =  data2.currentConditions.datetime;
    document.querySelector('#sunrise').innerHTML = onlyTime(data2.currentConditions.sunrise, 0);
    document.querySelector('#sunset').innerHTML = onlyTime(data.sys.sunset, 0);
    document.querySelector('#uv-index').innerHTML = data2.currentConditions.uvindex;
    document.querySelector('#humidity-status').innerHTML = setHumidityStatus(data.main.humidity);
}


// Function to set weather icon based on weather condition
function setWeatherIcon(weatherCondition) {
    switch (weatherCondition) {
        case 'Rain':
            weatherIcon.src = "icon/rainy-day.png";
            break;
        case 'Clear':
            weatherIcon.src = "icon/sun.png";
            break;
        case 'Clouds':
            weatherIcon.src = "icon/cloudy.png";
            break;
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
function formatDateTime(timestamp, timezone) {
    let date = new Date((timestamp + timezone) * 1000   );
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    let dayIndex  = date.getDay();
    var dayString = days[dayIndex];
    return dayString +', ' + date.toLocaleTimeString();
}


function onlyTime(timestamp, timezone) {
    const utcTimestamp = timestamp * 1000;
    const localDate = new Date(utcTimestamp + timezone * 1000);

    // Get hours and minutes
    const hours = localDate.getHours();
    const minutes = localDate.getMinutes();
    //to set into AM and PM format
    const amPm = hours >=12 ? "PM" : "AM";

    //to get the hours in 12 like format
    const displayHours = hours % 12 || 12;
    // Format the time string
    const formattedTime = `${hours < 10 ? '0' : ''}${displayHours}:${minutes < 10 ? '0' : ''}${minutes} ${amPm}`;
    
    return formattedTime;
}



// Main function to check API and update UI
async function weatherData(city){
    try {
        const data = await checkAPI(city);
        const data2 = await checkAPI2(city);
        updateUI(data, data2);
    } catch (error) {
        console.error("Error fetching or updating weather data:", error);
    }
}

//After clicking the button
searchBtn.addEventListener('click',()=>{
    weatherData(searchCity.value);
});


function updateDegree(unit){
    const temp = document.querySelector('#temp-unit');
    const temp2 = document.querySelector('.temp-unit');
    temp.textContent = unit;
    temp2.textContent = unit;
}

//In farenheit
farenheitbtn.addEventListener('click', () => {
    // Get the current city value from the input field
    const city = searchCity.value;

    // Call the checkAPI function to fetch weather data with imperial units
    checkAPI(city, 'imperial')
        .then(data => {
            // Update the UI with the new data
            updateUI(data);
            updateDegree('℉');
        })
        .catch(error => {
            console.error("Error fetching or updating weather data:", error);
        });
});

// In celcius
celciusBtn.addEventListener('click', () => {
    // Get the current city value from the input field
    const city = searchCity.value;

    // Call the checkAPI function to fetch weather data with imperial units
    checkAPI(city, 'metric')
        .then(data => {
            // Update the UI with the new data
            updateUI(data);
            updateDegree('℃');
        })
        .catch(error => {
            console.error("Error fetching or updating weather data:", error);
        });
});
