const form = document.querySelector('#form');
const input = document.querySelector('.form-control');

form.onsubmit = submitHandler;

async function submitHandler(e) {
    e.preventDefault();

    if (!input.value.trim()) {
        console.log('Enter city name');
        return
    }

    const cityInfo = await getGeo(input.value.trim());
    input.value = '';
    const weather = await getWeather(cityInfo['response']['GeoObjectCollection']['featureMember'][0]['GeoObject']['Point']['pos'].split(' '))

    console.log(weather);

    const WeatherData = {
        city: cityInfo['response']['GeoObjectCollection']['featureMember'][0]['GeoObject']['name'],
        city_desc: cityInfo['response']['GeoObjectCollection']['featureMember'][0]['GeoObject']['description'],

        temp: weather['main']['temp'],
        humidity: weather['main']['humidity'],
        speed: weather['wind']['speed'],
        desc: weather['weather']['0']['description'],
        icon: weather['weather']['0']['icon']
    }

    renderWeatherData(WeatherData)
}

async function getGeo(name) {
    const apikey = "dc11772f-23a1-4625-acf5-3340f33418db"

    const apiUrl = `https://geocode-maps.yandex.ru/1.x/?apikey=${apikey}&geocode=${name}&format=json`

    const response = await fetch(apiUrl);

    return await response.json();
}

async function getWeather(pos) {
    const apikey = "31199b47d15d2bf38c778c4cf2311c64"

    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${pos[1]}&lon=${pos[0]}&appid=${apikey}&units=metric&lang=ru`;

    const response = await fetch(apiUrl);

    return await response.json();
}

function renderWeatherData (data) {
    //https://openweathermap.org/img/wn/10d@2x.png
    const city = document.querySelector('.--city');
    const city_desc = document.querySelector('.--city-desc');
    const temp = document.querySelector('.--temp');
    const humidity = document.querySelector('.--humidity');
    const speed = document.querySelector('.--speed');
    const icon = document.querySelector('.--icon');


    city.innerText = data.city;
    city_desc.innerText = data.city_desc;
    temp.innerText = Math.round(data.temp) + '°';
    humidity.innerText = data.humidity + '%';
    speed.innerText = data.speed + ' м/c';
    icon.innerHTML = `<img width="80px" src="https://openweathermap.org/img/wn/${data.icon}@2x.png" alt="icon">`

}