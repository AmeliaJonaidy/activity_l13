// Modern JavaScript with ES6+ features
'use strict';

// Main application class for ShoreSquad
class ShoreSquad {
    constructor() {
        this.initializeApp();
    }    async initializeApp() {
        // Initialize AOS (Animate On Scroll)
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            offset: 50
        });

        // Initialize managers
        this.mapManager = new MapManager();
        this.weatherManager = new WeatherManager();
        this.communityManager = new CommunityManager();

        // Setup mobile menu
        this.setupMobileMenu();

        // Setup global event listeners
        this.setupEventListeners();
        
        // Initialize service worker for PWA support
        this.initServiceWorker();
    }

    setupEventListeners() {
        // Navigation smooth scroll
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Mobile menu toggle
        this.setupMobileMenu();

        // Handle scroll for navbar transparency
        this.handleNavbarScroll();
    }

    setupMobileMenu() {
        const menuToggle = document.querySelector('.menu-toggle');
        const navLinks = document.querySelector('.nav-links');
        const body = document.body;

        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'menu-overlay';
        body.appendChild(overlay);

        // Toggle menu
        menuToggle?.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navLinks?.classList.toggle('active');
            overlay.classList.toggle('active');
            body.style.overflow = navLinks?.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu when clicking overlay
        overlay.addEventListener('click', () => {
            menuToggle?.classList.remove('active');
            navLinks?.classList.remove('active');
            overlay.classList.remove('active');
            body.style.overflow = '';
        });

        // Close menu when clicking nav links
        navLinks?.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle?.classList.remove('active');
                navLinks.classList.remove('active');
                overlay.classList.remove('active');
                body.style.overflow = '';
            });
        });

        // Handle escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navLinks?.classList.contains('active')) {
                menuToggle?.classList.remove('active');
                navLinks.classList.remove('active');
                overlay.classList.remove('active');
                body.style.overflow = '';
            }
        });
    }

    handleNavbarScroll() {
        const navbar = document.querySelector('.navbar');
        if (!navbar) return;

        let lastScroll = 0;
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            // Add/remove background when scrolling
            if (currentScroll > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
            
            // Hide/show navbar based on scroll direction
            if (currentScroll > lastScroll && currentScroll > 500) {
                navbar.classList.add('nav-hidden');
            } else {
                navbar.classList.remove('nav-hidden');
            }
            
            lastScroll = currentScroll;
        });
    }

    async initServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                await navigator.serviceWorker.register('/service-worker.js');
                console.log('Service Worker registered successfully');
            } catch (error) {
                console.error('Service Worker registration failed:', error);
            }
        }
    }
}

// Initialize the app when the DOM is loaded
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new ShoreSquad();
});
