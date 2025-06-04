// ShoreSquad Main JavaScript

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize map
    initializeMap();
    
    // Initialize weather widget
    initializeWeather();
    
    // Initialize community feed
    initializeCommunityFeed();
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
        { lat: 1.3828, lng: 103.9360, name: "East Coast Park" },
        { lat: 1.2593, lng: 103.7645, name: "Sentosa Beach" },
        { lat: 1.4043, lng: 103.7858, name: "Sembawang Park" }
    ];

    // Add markers for cleanup locations
    cleanupLocations.forEach(location => {
        L.marker([location.lat, location.lng])
            .bindPopup(`<strong>${location.name}</strong><br>Join the next cleanup!`)
            .addTo(map);
    });
}

// Weather widget initialization
function initializeWeather() {
    const weatherWidget = document.querySelector('.weather-widget');
    
    // Placeholder for weather API integration
    // TODO: Integrate with weather API service
    weatherWidget.innerHTML = `
        <div class="weather-card">
            <h3>Current Beach Weather</h3>
            <p>Loading weather data...</p>
        </div>
    `;
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
