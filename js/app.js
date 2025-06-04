// ShoreSquad Main JavaScript

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeMap();
    initializeWeather();
    initializeCommunityFeed();
    
    // Refresh weather every 5 minutes
    setInterval(initializeWeather, 5 * 60 * 1000);
});

// Map initialization using Leaflet.js
function initializeMap() {
    // Create map centered on a default location
    const map = L.map('cleanup-map').setView([1.3521, 103.8198], 11); // Singapore coordinates

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Sample cleanup locations - replace with real data from backend
    const cleanupLocations = [
        { lat: 1.381497, lng: 103.955574, name: "Pasir Ris Beach" },
        { lat: 1.3828, lng: 103.9360, name: "East Coast Park" },
        { lat: 1.2593, lng: 103.7645, name: "Sentosa Beach" }
    ];

    // Add markers for cleanup locations
    cleanupLocations.forEach(location => {
        L.marker([location.lat, location.lng])
            .bindPopup(`<strong>${location.name}</strong><br>Join the next cleanup!`)
            .addTo(map);
    });
}

// Weather widget initialization
async function initializeWeather() {
    const weatherWidget = document.querySelector('.weather-widget');
    
    try {
        // Show loading state
        weatherWidget.innerHTML = `
            <div class="weather-card">
                <div class="weather-header">
                    <h3>Loading Weather Data</h3>
                    <div class="loading-spinner">
                        <i class="fas fa-spinner fa-spin"></i>
                    </div>
                </div>
            </div>
        `;

        // Get current date in Singapore timezone
        const now = new Date().toLocaleString('en-US', { timeZone: 'Asia/Singapore' });
        const currentDate = new Date(now).toISOString().split('T')[0];

        // Fetch weather data
        const [currentWeather, forecast] = await Promise.all([
            fetch(`https://api.data.gov.sg/v1/environment/2-hour-weather-forecast?date=${currentDate}`),
            fetch('https://api.data.gov.sg/v1/environment/4-day-weather-forecast')
        ]);

        if (!currentWeather.ok || !forecast.ok) {
            throw new Error('Weather API request failed');
        }

        const weatherData = await currentWeather.json();
        const forecastData = await forecast.json();

        // Validate data
        if (!weatherData.items?.length || !forecastData.items?.length) {
            throw new Error('No weather data available');
        }

        // Get Pasir Ris weather
        const pasirRisForecast = weatherData.items[0].forecasts.find(f => 
            f.area.toLowerCase().includes('pasir ris'));

        if (!pasirRisForecast) {
            throw new Error('Location not found in weather data');
        }

        // Update the display
        weatherWidget.innerHTML = `
            <div class="weather-card">
                <div class="weather-header">
                    <h3>Pasir Ris Beach Weather</h3>
                    <div class="current-weather">
                        <div class="weather-icon">
                            <i class="fas ${getWeatherIcon(pasirRisForecast.forecast)}"></i>
                        </div>
                        <div class="current-conditions">
                            <p class="current-forecast">${pasirRisForecast.forecast}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="forecast-container">
                <h3>4-Day Forecast</h3>
                <div class="forecast-cards">
                    ${forecastData.items[0].forecasts.map(day => `
                        <div class="forecast-day">
                            <h4>${formatDate(day.date)}</h4>
                            <i class="fas ${getWeatherIcon(day.forecast)}"></i>
                            <p class="forecast-temp">${day.temperature.low}°C - ${day.temperature.high}°C</p>
                            <p class="forecast-desc">${day.forecast}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        // Add last updated timestamp
        const lastUpdated = new Date(now).toLocaleTimeString('en-SG');
        weatherWidget.querySelector('.weather-header').insertAdjacentHTML('beforeend',
            `<div class="last-updated">Updated: ${lastUpdated}</div>`
        );

    } catch (error) {
        console.error('Weather error:', error);
        weatherWidget.innerHTML = `
            <div class="weather-card">
                <div class="weather-header">
                    <h3>Weather Information Temporarily Unavailable</h3>
                    <p>${error.message}</p>
                    <button onclick="initializeWeather()" class="retry-button">
                        <i class="fas fa-sync"></i> Retry
                    </button>
                </div>
            </div>
        `;
    }
}

function getWeatherIcon(forecast) {
    const f = forecast.toLowerCase();
    if (f.includes('thundery') || f.includes('thunder')) return 'fa-bolt';
    if (f.includes('rain') || f.includes('showers')) return 'fa-cloud-rain';
    if (f.includes('cloudy')) return 'fa-cloud';
    if (f.includes('overcast')) return 'fa-cloud';
    if (f.includes('fair') || f.includes('sunny')) return 'fa-sun';
    return 'fa-cloud';
}

function formatDate(dateStr) {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const date = new Date(dateStr);
    return `${days[date.getDay()]} ${date.getDate()}`;
}

// Community feed initialization
function initializeCommunityFeed() {
    const communityFeed = document.querySelector('.community-feed');
    
    // Sample community updates - replace with real data from backend
    const updates = [
        {
            username: "BeachHero",
            action: "Organized a cleanup",
            location: "East Coast Park",
            impact: "Collected 50kg of trash"
        },
        {
            username: "OceanGuardian",
            action: "Joined the squad",
            location: "Sentosa Beach",
            impact: "New member!"
        }
    ];

    // Render community updates
    updates.forEach(update => {
        const updateElement = document.createElement('div');
        updateElement.className = 'community-update';
        updateElement.innerHTML = `
            <h3>${update.username}</h3>
            <p>${update.action} at ${update.location}</p>
            <p class="impact">${update.impact}</p>
        `;
        communityFeed.appendChild(updateElement);
    });
}

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
