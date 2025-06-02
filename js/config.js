// Configuration settings for ShoreSquad application
const config = {
    // Map settings
    map: {
        center: [1.3521, 103.8198], // Default center (Singapore)
        zoom: 12,
        maxZoom: 18,
        minZoom: 3
    },
    
    // API endpoints
    api: {
        weather: 'https://api.openweathermap.org/data/2.5',
        // Add your API key here
        weatherApiKey: 'YOUR_OPENWEATHER_API_KEY'
    },
    
    // Animation settings
    animations: {
        counterDuration: 2,
        scrollOffset: 100
    },
    
    // Feature flags
    features: {
        enableRealTimeUpdates: true,
        enableNotifications: true,
        enableLocationSharing: true
    },
    
    // Community settings
    community: {
        maxSquadSize: 20,
        eventsPerPage: 6,
        refreshInterval: 300000 // 5 minutes
    }
};
