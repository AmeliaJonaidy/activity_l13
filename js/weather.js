// Weather handling for ShoreSquad application
class WeatherManager {
    constructor() {
        this.currentWeather = null;
        this.forecast = null;
        this.initWeather();
    }

    async initWeather() {
        this.setupWeatherContainers();
        await this.loadWeatherData();
        this.initUpdateInterval();
    }

    setupWeatherContainers() {
        const currentWeather = document.getElementById('current-weather');
        const forecast = document.getElementById('weather-forecast');
        
        if (currentWeather && forecast) {
            currentWeather.innerHTML = '<div class="loading">Loading current conditions...</div>';
            forecast.innerHTML = '<div class="loading">Loading forecast...</div>';
        }
    }

    async loadWeatherData(lat = config.map.center[0], lon = config.map.center[1]) {
        try {
            // In a real application, you would use your API key and make actual API calls
            // This is a simulation for demonstration purposes
            const weatherData = await this.simulateWeatherData();
            this.currentWeather = weatherData.current;
            this.forecast = weatherData.forecast;
            this.updateWeatherDisplay();
        } catch (error) {
            console.error('Error loading weather data:', error);
            showNotification('Unable to load weather data', 'error');
        }
    }

    updateWeatherDisplay() {
        this.updateCurrentWeather();
        this.updateForecast();
    }    updateCurrentWeather() {
        const container = document.getElementById('current-weather');
        if (!container || !this.currentWeather) return;

        container.innerHTML = `
            <div class="current-weather" data-aos="fade-up">
                <div class="weather-main">
                    <div class="location">
                        <i class="fas fa-map-marker-alt"></i>
                        <h3>${this.currentWeather.location}</h3>
                    </div>
                    <div class="weather-icon">
                        <i class="${this.getWeatherIcon(this.currentWeather.condition)}"></i>
                    </div>
                    <div class="temperature-group">
                        <div class="temperature">${this.currentWeather.temperature}°<span class="unit">C</span></div>
                        <div class="condition">${this.currentWeather.condition}</div>
                    </div>
                </div>
                <div class="weather-details">
                    <div class="detail-card">
                        <div class="detail-icon">
                            <i class="fas fa-wind"></i>
                        </div>
                        <div class="detail-info">
                            <span class="detail-label">Wind Speed</span>
                            <span class="detail-value">${this.currentWeather.windSpeed} km/h</span>
                        </div>
                    </div>
                    <div class="detail-card">
                        <div class="detail-icon">
                            <i class="fas fa-water"></i>
                        </div>
                        <div class="detail-info">
                            <span class="detail-label">Humidity</span>
                            <span class="detail-value">${this.currentWeather.humidity}%</span>
                        </div>
                    </div>
                    <div class="detail-card">
                        <div class="detail-icon">
                            <i class="fas fa-sun"></i>
                        </div>
                        <div class="detail-info">
                            <span class="detail-label">UV Index</span>
                            <span class="detail-value">${this.currentWeather.uvIndex}</span>
                        </div>
                    </div>
                </div>
                <div class="beach-conditions">
                    <h4><i class="fas fa-umbrella-beach"></i> Beach Conditions</h4>
                    <div class="condition-cards">
                        <div class="condition-card ${this.currentWeather.waveHeight < 1 ? 'good' : 'moderate'}">
                            <div class="condition-icon">
                                <i class="fas fa-wave-square"></i>
                            </div>
                            <div class="condition-info">
                                <span class="condition-label">Wave Height</span>
                                <span class="condition-value">${this.currentWeather.waveHeight}m</span>
                            </div>
                        </div>
                        <div class="condition-card ${this.currentWeather.visibility > 5 ? 'good' : 'moderate'}">
                            <div class="condition-icon">
                                <i class="fas fa-eye"></i>
                            </div>
                            <div class="condition-info">
                                <span class="condition-label">Visibility</span>
                                <span class="condition-value">${this.currentWeather.visibility}km</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }    updateForecast() {
        const container = document.getElementById('weather-forecast');
        if (!container || !this.forecast) return;

        container.innerHTML = this.forecast.map((day, index) => `
            <div class="forecast-card" data-aos="fade-up" data-aos-delay="${index * 100}">
                <div class="forecast-date">
                    <span class="day">${new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}</span>
                    <span class="date">${new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                </div>
                <div class="forecast-weather">
                    <div class="weather-icon">
                        <i class="${this.getWeatherIcon(day.condition)}"></i>
                    </div>
                    <div class="forecast-temps">
                        <div class="temp high">
                            <i class="fas fa-temperature-high"></i>
                            <span>${day.highTemp}°</span>
                        </div>
                        <div class="temp low">
                            <i class="fas fa-temperature-low"></i>
                            <span>${day.lowTemp}°</span>
                        </div>
                    </div>
                </div>
                <div class="forecast-condition">
                    <span class="condition-badge ${this.getConditionClass(day.condition)}">
                        ${day.condition}
                    </span>
                </div>
                <div class="forecast-details">
                    <div class="detail">
                        <i class="fas fa-umbrella"></i>
                        <span>${Math.round(Math.random() * 100)}%</span>
                    </div>
                    <div class="detail">
                        <i class="fas fa-wind"></i>
                        <span>${Math.round(Math.random() * 30)} km/h</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    getWeatherIcon(condition) {
        const iconMap = {
            'Clear': 'fas fa-sun',
            'Partly cloudy': 'fas fa-cloud-sun',
            'Cloudy': 'fas fa-cloud',
            'Rain': 'fas fa-cloud-rain',
            'Thunderstorm': 'fas fa-bolt',
            'Snow': 'fas fa-snowflake'
        };
        return iconMap[condition] || 'fas fa-cloud';
    }

    getConditionClass(condition) {
        const conditionMap = {
            'Clear': 'condition-clear',
            'Partly cloudy': 'condition-partly-cloudy',
            'Cloudy': 'condition-cloudy',
            'Rain': 'condition-rain',
            'Thunderstorm': 'condition-storm',
            'Snow': 'condition-snow'
        };
        return conditionMap[condition] || 'condition-default';
    }

    initUpdateInterval() {
        // Update weather data every 30 minutes
        setInterval(() => this.loadWeatherData(), 1800000);
    }

    simulateWeatherData() {
        // Simulate API response for demonstration
        return Promise.resolve({
            current: {
                location: 'East Coast Park',
                temperature: 28,
                condition: 'Partly cloudy',
                windSpeed: 15,
                humidity: 75,
                uvIndex: 6,
                waveHeight: 0.8,
                visibility: 8
            },
            forecast: [
                {
                    date: '2025-06-03',
                    highTemp: 29,
                    lowTemp: 24,
                    condition: 'Clear'
                },
                {
                    date: '2025-06-04',
                    highTemp: 28,
                    lowTemp: 23,
                    condition: 'Partly cloudy'
                },
                {
                    date: '2025-06-05',
                    highTemp: 27,
                    lowTemp: 23,
                    condition: 'Rain'
                }
            ]
        });
    }
}
