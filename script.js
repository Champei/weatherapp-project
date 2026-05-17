const input = document.getElementById("cityInput");
const button = document.getElementById("searchBtn");
const errorText = document.getElementById("erorrMsg");
const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const time = document.getElementById("time");
const card = document.getElementById("weatherCard");
const suggestionsEl = document.getElementById("suggestions");

input.addEventListener("input", fetchSuggestions);
button.addEventListener("click", fetchSuggestions);

async function fetchSuggestions() {
  suggestionsEl.innerHTML = "";
  const query = input.value.trim();
  card.classList.add('hidden');
  showLoading();
  if(!query) {
    errorText.innerHTML = "No city entered";
    card.classList.add('hidden');
    hideLoading();
    return;
  }
  errorText.innerHTML = "";
  try {
    const resp = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${query}&count=5`);
    const data = await resp.json();
    renderCitiesList(data.results);
  } catch (err) {
    hideLoading();
  }
}

async function getWeatherByCoords(city) {
    const {name, country, latitude, longitude} = city;
    showLoading();
    try {
        const resp = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m`);
        const data = await resp.json();
        const current = data.current;
        
        cityName.textContent = `${name}, ${country}`;
        temperature.textContent = `${current.temperature_2m} °C`;
        time.textContent = `${current.time}`;

        hideLoading();
        card.classList.remove('hidden');
    } catch (err) {
        hideLoading();
    }
}

function renderCitiesList (cities) {
    if (!cities || cities.length === 0) {
        const li = document.createElement('li');
        li.textContent = "No cities found..!";
        suggestionsEl.appendChild(li);
        hideLoading();
        return;
    }

    cities.forEach(city => {
        const li = document.createElement('li');
        li.textContent = `${city.name}, ${city.country}`;
        li.addEventListener("click", () => {
            input.value = `${city.name}, ${city.country}`;
            suggestionsEl.innerHTML = "";
            getWeatherByCoords(city);
        });
        suggestionsEl.appendChild(li);
    });
    hideLoading();
}

function hideLoading() {
    button.disabled = false;
    button.textContent = "Search";
}

function showLoading() {    
    button.disabled = true;
    button.textContent = "Loading...";
}