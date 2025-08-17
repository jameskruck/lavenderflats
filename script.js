// FAQ toggle functionality (global function needed for HTML onclick)
function toggleFAQ(element) {
    const answer = element.nextElementSibling;
    const toggle = element.querySelector('.faq-toggle');
    
    // Close all other FAQ items
    document.querySelectorAll('.faq-answer').forEach(item => {
        if (item !== answer) {
            item.classList.remove('active');
            item.previousElementSibling.querySelector('.faq-toggle').classList.remove('active');
            item.previousElementSibling.querySelector('.faq-toggle').textContent = '+';
        }
    });
    
    // Toggle current FAQ item
    answer.classList.toggle('active');
    toggle.classList.toggle('active');
    toggle.textContent = answer.classList.contains('active') ? '×' : '+';
}

// Initialize the map
function initializeMap() {
    // Check if Leaflet is loaded
    if (typeof L === 'undefined') {
        console.error('Leaflet library not loaded yet');
        setTimeout(initializeMap, 500);
        return;
    }

    // Check if map div exists
    const mapDiv = document.getElementById('map');
    if (!mapDiv) {
        console.error('Map div not found');
        return;
    }

    try {
        // Coordinates for Wortley Village area - you'll need to replace these with exact coordinates
        // These are approximate coordinates for Wortley Village
        const houseCoords = [42.97452384513511, -81.25938468444939]; // Updated coordinates for Wortley Village area
        
        const map = L.map('map').setView(houseCoords, 16);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        // Add marker for Lavender Flats
        const homeMarker = L.marker(houseCoords).addTo(map)
            .bindPopup('<b>🏠 Lavender Flats</b><br>46 Byron Avenue East<br>Wortley Village, London ON<br>N6C 1C5').openPopup();

        // Add nearby amenities markers
        const amenities = [
            {lat: 42.97397280104831, lng: -81.25432070204505, name: "☕ Black Walnut Bakery", popup: "Black Walnut Bakery Café<br>5 min walk"},
            {lat: 42.97160957333061, lng: -81.25259089582431, name: "🛒 Valu-Mart", popup: "Valu-Mart Grocery<br>10 min walk"},
            {lat: 42.9722868092589, lng: -81.25300814985873, name: "🛒 Plant Matter Kitchen", popup: "Plant Matter Kitchen<br>8 min walk"},
            {lat: 42.973821218294795, lng: -81.26104549626216, name: "🚌 Bus Stop", popup: "Bus Stop 2022 (Routes 7, 12 & 93)<br>2 min walk"},
            {lat: 42.97576131969793, lng: -81.25349636456085, name: "🌳 Thames Park", popup: "Thames Park<br>5 min walk"},
            {lat: 42.973389595078245, lng: -81.26136434853541, name: "🏛️ Victoria Public School", popup: "Victoria Public School<br>5 min walk"},
            {lat: 42.97349397699805, lng: -81.25346568990425, name: "🔨 Home Hardware", popup: "Home Hardware<br>5 min walk"},
            {lat: 42.96061185041349, lng: -81.22466672819226, name: "🏥 Victoria Hospital", popup: "Victoria Hospital<br>8 min drive"},
            {lat: 43.0097225583683, lng: -81.27333662665775, name: "🏢 Downtown London", popup: "Downtown London<br>10 min drive"}
        ];

        amenities.forEach(amenity => {
            L.marker([amenity.lat, amenity.lng])
                .addTo(map)
                .bindPopup(amenity.popup);
        });

        // Add a circle to show walkable area around the house
        L.circle(houseCoords, {
            color: '#9c88d4',
            fillColor: '#9c88d4',
            fillOpacity: 0.1,
            radius: 800
        }).addTo(map).bindPopup('800m walking radius from Lavender Flats');

        console.log('Map initialized successfully');
        
    } catch (error) {
        console.error('Error initializing map:', error);
    }
}

// Wait for DOM to be fully loaded before initializing everything
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing scripts...');

    // Smooth scrolling navigation
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

    // Active navigation highlighting
    window.addEventListener('scroll', () => {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // Fade-in animation on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe all fade-in elements
    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });

    // PDF download tracking (optional analytics)
    document.querySelectorAll('a[download*="Application"]').forEach(link => {
        link.addEventListener('click', function() {
            console.log('Application PDF downloaded');
            // You could add analytics tracking here if needed
        });
    });

    // Add some dynamic pricing updates based on availability
    function updateAvailability() {
        const upperUnit = document.querySelector('.unit-card:first-child .unit-availability');
        const mainUnit = document.querySelector('.unit-card:last-child .unit-availability');
        
        if (upperUnit && mainUnit) {
            // This could be connected to a real availability API
            const availabilityStatus = {
                upper: 'Available Now',
                main: 'Available Dec 1'
            };
            
            upperUnit.textContent = availabilityStatus.upper;
            mainUnit.textContent = availabilityStatus.main;
        }
    }

    // Initialize availability updates
    updateAvailability();

    // Add weather widget placeholder functionality
    function addWeatherWidget() {
        const neighborhoodSection = document.querySelector('#neighborhood .container');
        if (neighborhoodSection) {
            const weatherDiv = document.createElement('div');
            weatherDiv.innerHTML = `
                <div style="background: white; padding: 1rem; border-radius: 10px; box-shadow: 0 5px 15px rgba(156, 136, 212, 0.15); text-align: center; margin: 2rem auto; max-width: 300px;">
                    <div style="color: #7b68c4; font-weight: bold;">London, ON Weather</div>
                    <div style="font-size: 2rem; margin: 0.5rem 0;">🌤️ 18°C</div>
                    <div style="color: #666; font-size: 0.9rem;">Perfect weather for a neighborhood walk!</div>
                </div>
            `;
            neighborhoodSection.appendChild(weatherDiv);
        }
    }

    // Add the weather widget
    addWeatherWidget();

    // Gallery tab switching functionality
    function initializeGalleryTabs() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetTab = button.getAttribute('data-tab');
                
                // Remove active class from all buttons and content
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));
                
                // Add active class to clicked button
                button.classList.add('active');
                
                // Show corresponding content
                const targetContent = document.getElementById(`${targetTab}-tab`);
                if (targetContent) {
                    targetContent.classList.add('active');
                }
            });
        });
    }

    // Initialize gallery tabs
    initializeGalleryTabs();

    // Initialize the map after a short delay to ensure all resources are loaded
    setTimeout(initializeMap, 2000);
});