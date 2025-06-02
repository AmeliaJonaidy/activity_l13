// Map handling for ShoreSquad application
class MapManager {
    constructor() {
        this.map = null;
        this.markers = [];
        this.events = [];
        this.initMap();
    }

    initMap() {
        // Initialize the map
        this.map = L.map('cleanup-map', {
            center: config.map.center,
            zoom: config.map.zoom,
            maxZoom: config.map.maxZoom,
            minZoom: config.map.minZoom
        });

        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(this.map);

        // Add custom control for user location
        this.addLocationControl();

        // Initialize event handlers
        this.initEventHandlers();
        
        // Load initial events
        this.loadCleanupEvents();
    }

    addLocationControl() {
        const locationControl = L.Control.extend({
            options: {
                position: 'topleft'
            },
            onAdd: (map) => {
                const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control location-control');
                const button = L.DomUtil.create('a', 'location-button', container);
                button.innerHTML = '<i class="fas fa-location-arrow"></i>';
                button.href = '#';
                
                L.DomEvent.on(button, 'click', (e) => {
                    L.DomEvent.preventDefault(e);
                    this.centerOnUserLocation();
                });
                
                return container;
            }
        });
        
        this.map.addControl(new locationControl());
    }

    centerOnUserLocation() {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    this.map.setView([latitude, longitude], 13);
                    this.showNearbyEvents(latitude, longitude);
                },
                (error) => {
                    showNotification('Unable to access your location. Please check your settings.', 'error');
                }
            );
        } else {
            showNotification('Geolocation is not supported by your browser.', 'error');
        }
    }

    async loadCleanupEvents() {
        try {
            // Simulate loading events from an API
            // Replace with actual API call in production
            const events = [
                {
                    id: 1,
                    title: 'East Coast Beach Cleanup',
                    location: [1.3, 103.9],
                    date: '2025-06-15T09:00:00',
                    participants: 15,
                    maxParticipants: 30
                },
                {
                    id: 2,
                    title: 'Sentosa Coastal Cleanup',
                    location: [1.25, 103.82],
                    date: '2025-06-20T08:30:00',
                    participants: 8,
                    maxParticipants: 20
                }
            ];

            this.events = events;
            this.displayEvents();
        } catch (error) {
            console.error('Error loading cleanup events:', error);
            showNotification('Failed to load cleanup events.', 'error');
        }
    }

    displayEvents() {
        // Clear existing markers
        this.markers.forEach(marker => marker.remove());
        this.markers = [];

        // Clear event sidebar
        const sidebar = document.getElementById('event-sidebar');
        sidebar.innerHTML = '';

        // Add new markers and sidebar items
        this.events.forEach(event => {
            // Create marker
            const marker = L.marker(event.location)
                .bindPopup(this.createPopupContent(event))
                .addTo(this.map);
            
            this.markers.push(marker);

            // Create sidebar item
            const eventElement = this.createSidebarElement(event);
            sidebar.appendChild(eventElement);
        });
    }

    createPopupContent(event) {
        return `
            <div class="event-popup">
                <h3>${event.title}</h3>
                <p><i class="far fa-calendar"></i> ${formatDate(event.date)}</p>
                <p><i class="fas fa-users"></i> ${event.participants}/${event.maxParticipants} participants</p>
                <button onclick="app.mapManager.joinEvent(${event.id})" 
                        class="popup-join-btn">Join Cleanup</button>
            </div>
        `;
    }

    createSidebarElement(event) {
        const div = document.createElement('div');
        div.className = 'event-item';
        div.innerHTML = `
            <h4>${event.title}</h4>
            <p class="event-date"><i class="far fa-calendar"></i> ${formatDate(event.date)}</p>
            <p class="event-participants">
                <i class="fas fa-users"></i> ${event.participants}/${event.maxParticipants} participants
            </p>
            <button onclick="app.mapManager.joinEvent(${event.id})" 
                    class="join-event-btn">Join Cleanup</button>
        `;
        return div;
    }

    joinEvent(eventId) {
        // Implement join event functionality
        // This would typically involve an API call and user authentication
        showNotification('Feature coming soon! Stay tuned.', 'info');
    }

    initEventHandlers() {
        // Add filter button handlers
        document.querySelectorAll('.filter-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-btn').forEach(btn => 
                    btn.classList.remove('active'));
                e.target.classList.add('active');
                this.filterEvents(e.target.dataset.filter);
            });
        });
    }

    filterEvents(filter) {
        // Implement event filtering logic based on the selected filter
        // This is a placeholder implementation
        switch(filter) {
            case 'upcoming':
                // Filter for upcoming events
                break;
            case 'popular':
                // Filter for popular events
                break;
            default:
                // Show all events
                this.displayEvents();
        }
    }

    showNearbyEvents(latitude, longitude) {
        // Filter and display events near the given coordinates
        const nearbyEvents = this.events.filter(event => {
            const distance = calculateDistance(
                latitude, 
                longitude, 
                event.location[0], 
                event.location[1]
            );
            return distance <= 10; // Within 10km
        });

        // Update markers and sidebar for nearby events
        this.events = nearbyEvents;
        this.displayEvents();
    }
}
