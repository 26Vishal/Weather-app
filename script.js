document.addEventListener('DOMContentLoaded', () => {
    const apiKey = '5d04dd366ace4ef8928142428252009'; // Replace with your own API key if needed
    const searchForm = document.getElementById('search-form');
    const cityInput = document.getElementById('city-input');
    const weatherInfo = document.getElementById('weather-info');
    const errorMessage = document.getElementById('error-message');
    const loader = document.getElementById('loader');

    // --- DOM Element Selectors ---
    const cityNameEl = document.getElementById('city-name');
    const countryNameEl = document.getElementById('country-name');
    const weatherIconEl = document.getElementById('weather-icon');
    const temperatureEl = document.getElementById('temperature');
    const conditionEl = document.getElementById('condition');
    const feelsLikeEl = document.getElementById('feels-like');
    const humidityEl = document.getElementById('humidity');
    const windSpeedEl = document.getElementById('wind-speed');
    const aqiEl = document.getElementById('aqi');

    /**
     * Fetches weather data from the API for a given city.
     * @param {string} city The name of the city to fetch weather for.
     */
    const fetchWeather = async (city) => {
        weatherInfo.classList.add('hidden');
        errorMessage.classList.add('hidden');
        loader.classList.remove('hidden');

        try {
            const apiUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=yes`;
            const response = await fetch(apiUrl);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error.message || `City not found.`);
            }
            const data = await response.json();
            updateUI(data);
        } catch (error) {
            console.error("Error fetching weather:", error);
            showError(error.message);
        } finally {
            loader.classList.add('hidden');
        }
    };

    /**
     * Updates the UI with the fetched weather data.
     * @param {object} data The weather data object from the API.
     */
    const updateUI = (data) => {
        const { location, current } = data;

        cityNameEl.textContent = location.name;
        countryNameEl.textContent = location.country;
        weatherIconEl.src = `https:${current.condition.icon}`;
        weatherIconEl.alt = current.condition.text;
        temperatureEl.innerHTML = `${Math.round(current.temp_c)}&deg;C`;
        conditionEl.textContent = current.condition.text;
        feelsLikeEl.innerHTML = `${Math.round(current.feelslike_c)}&deg;C`;
        humidityEl.textContent = `${current.humidity}%`;
        windSpeedEl.textContent = `${current.wind_kph} kph`;
        aqiEl.textContent = getAqiDescription(current.air_quality['us-epa-index']);
        
        updateBackground(current.condition.text);

        weatherInfo.classList.remove('hidden');
        weatherInfo.classList.add('fade-in-up');
        // Remove the animation class after it completes to allow it to run again
        setTimeout(() => weatherInfo.classList.remove('fade-in-up'), 700);
    };

    /**
     * Updates the body background based on the weather condition.
     * @param {string} conditionText The weather condition text (e.g., "Sunny").
     */
    const updateBackground = (conditionText) => {
        const body = document.body;
        const condition = conditionText.toLowerCase();

        if (condition.includes('sun') || condition.includes('clear')) {
            body.style.background = 'linear-gradient(to top, #2980b9, #6dd5fa, #ffffff)';
        } else if (condition.includes('cloud') || condition.includes('overcast')) {
            body.style.background = 'linear-gradient(to top, #4b79a1, #283e51)';
        } else if (condition.includes('rain') || condition.includes('drizzle')) {
            body.style.background = 'linear-gradient(to top, #093028, #237a57)';
        } else if (condition.includes('mist') || condition.includes('fog')) {
            body.style.background = 'linear-gradient(to top, #bdc3c7, #2c3e50)';
        } else if (condition.includes('snow') || condition.includes('sleet') || condition.includes('ice')) {
            body.style.background = 'linear-gradient(to top, #e6dada, #274046)';
        } else if (condition.includes('thunder')) {
            body.style.background = 'linear-gradient(to top, #0f2027, #203a43, #2c5364)';
        } else {
            body.style.background = 'linear-gradient(to top, #1e3c72, #2a5298)';
        }
    };
    
    /**
     * Converts US EPA AQI index to a human-readable description.
     * @param {number} index The AQI index number.
     * @returns {string} A descriptive string for the AQI.
     */
    const getAqiDescription = (index) => {
        switch (index) {
            case 1: return 'Good';
            case 2: return 'Moderate';
            case 3: return 'Unhealthy (SG)'; // SG: Sensitive Groups
            case 4: return 'Unhealthy';
            case 5: return 'Very Unhealthy';
            case 6: return 'Hazardous';
            default: return 'Unknown';
        }
    };

    /**
     * Displays an error message to the user.
     * @param {string} message The error message to display.
     */
    const showError = (message) => {
        errorMessage.textContent = `Error: ${message}`;
        errorMessage.classList.remove('hidden');
        weatherInfo.classList.add('hidden');
    };

    // --- Event Listeners ---
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const city = cityInput.value.trim();
        if (city) {
            fetchWeather(city);
        } else {
            showError("Please enter a city name.");
        }
        cityInput.value = '';
    });

    // --- Initial Load ---
    // Fetch weather for a default city when the page loads
    fetchWeather('New Delhi');
});
