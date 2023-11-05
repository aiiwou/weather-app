const api = {
    base: `https://api.openweathermap.org/data/2.5/`,
    key: `f66764f3a9583a423d833400d53a9293`
}

const dateBuilder = (d) => {
    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ];

    const days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
    ];

    const day = days[d.getDay()];
    const date = d.getDate();
    const month = months[d.getMonth()];
    const year = d.getFullYear();

    return `${day} ${date} ${month} ${year}`;
}

const app = document.querySelector('.app');
const container = document.querySelector('.location-container');
const input = document.querySelector('.searchbar');

let city = localStorage.getItem('city') || "Ekaterinburg";
let store = {};

input.addEventListener('keyup', (e) => {
    const value = e.target.value;
    if (e.key == 'Enter' && value) {
        city = value;
        localStorage.setItem('city', city);
        fetchData();
        e.target.value = '';
    }
})

const fetchData = async () => {
    getLoader();
    const response = await fetch(`${api.base}weather?q=${city}&appid=${api.key}`).then(res => res.json());
    const { name, weather, main: { temp }, sys: { country } } = response;
    store = {
        name,
        weather: weather[0].main,
        temp,
        country
    }

    renderComponent();
}

const getLoader = () => {
    container.innerHTML = `<span class="loader"></span>`
}

const setBackground = () => {
    app.classList = Math.floor(store.temp - 273) >= 15 ? 'app warm' : 'app';
}

const renderComponent = () => {
    container.innerHTML = getContent();
    setBackground();
}

const getContent = () => {
    const { name, weather, temp, country } = store;
    return `<div class="location-box">
    <div class="location">
        ${name}, ${country}
    </div>
    <div class="date">${dateBuilder(new Date())}</div>
</div>
<div class="weather-box">
    <div class="temp">${Math.floor(temp - 273)} °C</div>
    <div class="weather">${weather}</div>
</div>`
}

fetchData()