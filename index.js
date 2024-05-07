// const temp = document.querySelector('.temp');

const apiKey = "6df3f95fbc9eb9deb9e6dac8d39a5a9c";
const url = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
const searchCity = document.querySelector('#search-city');
const searchBtn = document.querySelector('#text');
const weatherIcon = document.querySelector('#weather-inner');

async function checkAPI(city){
const api = await fetch(url + city + `&appid=${apiKey}`);
let data = await api.json();
console.log(data);

document.querySelector('.location').innerHTML = data.name;
document.querySelector('.temp').innerHTML = Math.round(data.main.temp);
document.querySelector('#temp2').innerHTML = Math.round(data.main.temp);
document.querySelector('#humidity').innerHTML = data.main.humidity + "%";
document.querySelector('#wind-speed').innerHTML = data.wind.speed;
document.querySelector('#visibility').innerHTML = data.visibility;
document.querySelector('#cond').innerHTML = data.weather[0].main;
if(data.weather[0].main == 'Rain'){
weatherIcon.src = "icon/rainy-day.png";
}
else if(data.weather[0].main == 'Clear'){
    weatherIcon.src = "icon/sun.png";
}
else if(data.weather[0].main == 'Clouds'){
    weatherIcon.src = "icon/cloudy.png";

}

let date = data.dt;
var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const convertDate = new Date(date * 1000);
let dayIndex  = convertDate.getDay();
var dayString = days[dayIndex];
const string = convertDate.toLocaleTimeString();
document.querySelector('#date-time').innerHTML = dayString +", " + string;

}
searchBtn.addEventListener('click',()=>{
    checkAPI(searchCity.value);
})



