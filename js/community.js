// Community features for ShoreSquad application
class CommunityManager {
    constructor() {
        this.squads = [];
        this.stats = {
            totalCleanups: 0,
            totalVolunteers: 0,
            totalWaste: 0
        };
        this.initCommunity();
    }

    async initCommunity() {
        await this.loadCommunityData();
        this.initializeCounters();
        this.setupEventListeners();
    }

    async loadCommunityData() {
        try {
            // Simulate API call to load community data
            const data = await this.simulateCommunityData();
            this.squads = data.squads;
            this.stats = data.stats;
            this.updateCommunityDisplay();
        } catch (error) {
            console.error('Error loading community data:', error);
            showNotification('Unable to load community data', 'error');
        }
    }

    updateCommunityDisplay() {
        this.updateSquadGrid();
        this.updateStats();
    }

    updateSquadGrid() {
        const container = document.querySelector('.squad-grid');
        if (!container) return;

        container.innerHTML = this.squads.map(squad => `
            <div class="squad-card" data-aos="fade-up">
                <div class="squad-header">
                    <h3>${squad.name}</h3>
                    <span class="squad-level">Level ${squad.level}</span>
                </div>
                <div class="squad-content">
                    <div class="squad-stats">
                        <div class="stat">
                            <i class="fas fa-users"></i>
                            <span>${squad.members}/${squad.maxMembers}</span>
                        </div>
                        <div class="stat">
                            <i class="fas fa-trash-alt"></i>
                            <span>${formatNumber(squad.wasteCollected)}kg</span>
                        </div>
                        <div class="stat">
                            <i class="fas fa-calendar-check"></i>
                            <span>${squad.eventsCompleted}</span>
                        </div>
                    </div>
                    <div class="squad-description">
                        <p>${squad.description}</p>
                    </div>
                    <div class="next-event">
                        <h4>Next Cleanup</h4>
                        <p><i class="far fa-calendar"></i> ${formatDate(squad.nextEvent.date)}</p>
                        <p><i class="fas fa-map-marker-alt"></i> ${squad.nextEvent.location}</p>
                    </div>
                    <button class="join-squad-btn" onclick="app.communityManager.joinSquad('${squad.id}')">
                        Join Squad
                    </button>
                </div>
            </div>
        `).join('');
    }

    updateStats() {
        // Update impact counters
        const counters = {
            totalCleanups: document.getElementById('totalCleanups'),
            totalVolunteers: document.getElementById('totalVolunteers'),
            totalWaste: document.getElementById('totalWaste'),
            beachesCleaned: document.getElementById('beachesCleaned'),
            activeCommunity: document.getElementById('activeCommunity'),
            impactMade: document.getElementById('impactMade')
        };

        Object.entries(counters).forEach(([key, element]) => {
            if (element) {
                animateCounter(element, this.stats[key]);
            }
        });
    }

    setupEventListeners() {
        // Join CTA button
        const joinButton = document.getElementById('joinNow');
        if (joinButton) {
            joinButton.addEventListener('click', () => this.showJoinModal());
        }
    }

    showJoinModal() {
        // Create and show the join modal
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content" data-aos="zoom-in">
                <h2>Join ShoreSquad</h2>
                <form id="joinForm" class="join-form">
                    <div class="form-group">
                        <label for="name">Full Name</label>
                        <input type="text" id="name" required>
                    </div>
                    <div class="form-group">
                        <label for="email">Email</label>
                        <input type="email" id="email" required>
                    </div>
                    <div class="form-group">
                        <label for="location">Preferred Beach Location</label>
                        <select id="location" required>
                            <option value="">Select a location</option>
                            <option value="east-coast">East Coast Beach</option>
                            <option value="sentosa">Sentosa Beach</option>
                            <option value="punggol">Punggol Beach</option>
                        </select>
                    </div>
                    <button type="submit" class="primary-btn">Join Now</button>
                </form>
                <button class="close-modal"><i class="fas fa-times"></i></button>
            </div>
        `;

        document.body.appendChild(modal);
        
        // Add event listeners
        modal.querySelector('.close-modal').addEventListener('click', () => {
            modal.remove();
        });

        modal.querySelector('#joinForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleJoinSubmission(e.target);
            modal.remove();
        });
    }

    async handleJoinSubmission(form) {
        const formData = {
            name: form.name.value,
            email: form.email.value,
            location: form.location.value
        };

        // In a real application, this would be an API call
        // For now, just show a success message
        showNotification('Welcome to ShoreSquad! Check your email for next steps.', 'success');
    }

    async joinSquad(squadId) {
        // In a real application, this would be an API call
        showNotification('Squad join request sent! The squad leader will contact you soon.', 'success');
    }

    simulateCommunityData() {
        return Promise.resolve({
            squads: [
                {
                    id: 'squad1',
                    name: 'Beach Warriors',
                    level: 5,
                    members: 15,
                    maxMembers: 20,
                    wasteCollected: 1250,
                    eventsCompleted: 25,
                    description: 'Dedicated team focusing on East Coast Park cleanups',
                    nextEvent: {
                        date: '2025-06-15T09:00:00',
                        location: 'East Coast Park Area C'
                    }
                },
                {
                    id: 'squad2',
                    name: 'Ocean Guardians',
                    level: 4,
                    members: 12,
                    maxMembers: 20,
                    wasteCollected: 980,
                    eventsCompleted: 18,
                    description: 'Weekend warriors keeping Sentosa clean',
                    nextEvent: {
                        date: '2025-06-20T08:30:00',
                        location: 'Sentosa Siloso Beach'
                    }
                }
            ],
            stats: {
                totalCleanups: 168,
                totalVolunteers: 450,
                totalWaste: 5280,
                beachesCleaned: 15,
                activeCommunity: 450,
                impactMade: 5280
            }
        });
    }
}
