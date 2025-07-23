// JavaScript for SOET Website Functionality

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('.nav ul');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
            nav.style.flexDirection = 'column';
            nav.style.position = 'absolute';
            nav.style.top = '100%';
            nav.style.left = '0';
            nav.style.right = '0';
            nav.style.backgroundColor = 'white';
            nav.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
            nav.style.padding = '20px';
            nav.style.zIndex = '1001';
        });
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Tab functionality for activities section
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Remove active class from all buttons and panes
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            // Add active class to clicked button and corresponding pane
            this.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });

    // Header scroll effect
    const header = document.querySelector('.header');
    let lastScrollTop = 0;

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.backgroundColor = 'white';
            header.style.backdropFilter = 'none';
        }
        
        lastScrollTop = scrollTop;
    });

    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Add fade-in class to elements that should animate
    const animateElements = document.querySelectorAll('.stat-item, .program-card, .facility-item, .activity-item, .highlight-item, .contact-item');
    animateElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });

    // Counter animation for statistics
    function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);
        
        function updateCounter() {
            start += increment;
            if (start < target) {
                element.textContent = Math.ceil(start);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        }
        
        updateCounter();
    }

    // Initialize counters when hero section is visible
    const heroObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counters = [
                    { element: document.querySelector('.stat-item:nth-child(1) h3'), target: 1957 },
                    { element: document.querySelector('.stat-item:nth-child(2) h3'), target: 11 },
                    { element: document.querySelector('.stat-item:nth-child(3) h3'), target: 2200 },
                    { element: document.querySelector('.stat-item:nth-child(4) h3'), target: 30 },
                    { element: document.querySelector('.stat-item:nth-child(5) h3'), target: 100 }
                ];
                
                counters.forEach(counter => {
                    if (counter.element && !counter.element.classList.contains('animated')) {
                        counter.element.classList.add('animated');
                        animateCounter(counter.element, counter.target);
                    }
                });
                
                heroObserver.unobserve(entry.target);
            }
        });
    });

    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        heroObserver.observe(heroStats);
    }

    // Form handling
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const name = this.querySelector('input[type="text"]').value;
            const email = this.querySelector('input[type="email"]').value;
            const subject = this.querySelectorAll('input[type="text"]')[1].value;
            const message = this.querySelector('textarea').value;
            
            // Basic validation
            if (!name || !email || !subject || !message) {
                alert('Please fill in all fields.');
                return;
            }
            
            if (!isValidEmail(email)) {
                alert('Please enter a valid email address.');
                return;
            }
            
            // Simulate form submission
            const submitBtn = this.querySelector('.btn-primary');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                alert('Thank you for your message! We will get back to you soon.');
                this.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }

    // Email validation function
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Visitor counter simulation
    function updateVisitorCount() {
        const visitorCountElement = document.getElementById('visitor-count');
        if (visitorCountElement) {
            let count = localStorage.getItem('visitorCount') || 12345;
            count = parseInt(count) + Math.floor(Math.random() * 5) + 1;
            localStorage.setItem('visitorCount', count);
            visitorCountElement.textContent = count.toLocaleString();
        }
    }

    updateVisitorCount();

    // Parallax effect for hero section
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const heroContent = document.querySelector('.hero-content');
        
        if (heroContent && scrolled < window.innerHeight) {
            heroContent.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });

    // Image lazy loading
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));

    // Back to top button
    const backToTopBtn = document.createElement('button');
    backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background-color: var(--primary-red);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        display: none;
        z-index: 1000;
        transition: all 0.3s ease;
        box-shadow: 0 3px 15px rgba(132, 28, 44, 0.3);
    `;

    document.body.appendChild(backToTopBtn);

    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.style.display = 'block';
        } else {
            backToTopBtn.style.display = 'none';
        }
    });

    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Add hover effects to cards
    const cards = document.querySelectorAll('.program-card, .facility-item, .link-card, .activity-item');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Add typing effect to hero title
    function typeWriter(element, text, speed = 100) {
        let i = 0;
        element.textContent = '';
        
        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        
        type();
    }

    // Initialize typing effect after a delay
    setTimeout(() => {
        const heroTitle = document.querySelector('.hero-content h2');
        if (heroTitle) {
            const originalText = heroTitle.textContent;
            typeWriter(heroTitle, originalText, 80);
        }
    }, 1000);

    // Add smooth reveal animations
    function revealOnScroll() {
        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            const sectionVisible = 150;
            
            if (sectionTop < window.innerHeight - sectionVisible) {
                section.classList.add('section-visible');
            }
        });
    }

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Initial check

    // Add CSS for section animations
    const style = document.createElement('style');
    style.textContent = `
        section {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.8s ease;
        }
        
        section.section-visible {
            opacity: 1;
            transform: translateY(0);
        }
        
        .hero {
            opacity: 1;
            transform: translateY(0);
        }
        
        .back-to-top:hover {
            background-color: #6d1622 !important;
            transform: translateY(-2px);
        }
    `;
    document.head.appendChild(style);

    console.log('SOET Website loaded successfully!');
});

// Multi-page functionality

// Update active navigation state
function updateActiveNav() {
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.nav a');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        const linkPage = link.getAttribute('href');
        
        if (currentPage === linkPage || 
           (currentPage === '' && linkPage === 'index.html') ||
           (currentPage === 'index.html' && linkPage === 'index.html')) {
            link.classList.add('active');
        }
    });
}

// Contact form validation and handling
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const data = {};
        
        // Convert FormData to object
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        
        // Basic validation
        if (!data.name || !data.email || !data.phone || !data.message) {
            showNotification('Please fill in all required fields.', 'error');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            showNotification('Please enter a valid email address.', 'error');
            return;
        }
        
        // Phone validation (basic)
        const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
        if (!phoneRegex.test(data.phone)) {
            showNotification('Please enter a valid phone number.', 'error');
            return;
        }
        
        // Check newsletter consent
        if (!data.newsletter) {
            data.newsletter = 'no';
        } else {
            data.newsletter = 'yes';
        }
        
        // Simulate form submission
        showNotification('Thank you for your inquiry! We will get back to you soon.', 'success');
        
        // Reset form
        this.reset();
        
        // In a real application, you would send this data to your server
        console.log('Form submitted with data:', data);
    });
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-triangle' : 'fa-info-circle'}"></i>
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add CSS styles for notification
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 1000;
        display: flex;
        align-items: center;
        gap: 10px;
        max-width: 400px;
        animation: slideIn 0.3s ease;
    `;
    
    // Add notification to body
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Initialize tab functionality for activities page
function initTabFunctionality() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    if (tabButtons.length === 0) return;
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');
            
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            button.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });
}

// Smooth scrolling for internal links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Initialize search functionality (if search box exists)
function initSearchFunctionality() {
    const searchInput = document.querySelector('#search-input');
    if (!searchInput) return;
    
    searchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            const query = this.value.trim();
            if (query) {
                // In a real application, implement search functionality
                console.log('Searching for:', query);
                showNotification(`Searching for "${query}"...`, 'info');
            }
        }
    });
}

// Animate elements on scroll
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements that should animate
    document.querySelectorAll('.program-card, .facility-card, .activity-item, .club-card, .department-card, .action-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Add CSS animation keyframes
function addAnimationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        
        .notification button {
            background: none;
            border: none;
            color: inherit;
            cursor: pointer;
            padding: 5px;
            border-radius: 3px;
            transition: background-color 0.2s ease;
        }
        
        .notification button:hover {
            background-color: rgba(255,255,255,0.2);
        }
    `;
    document.head.appendChild(style);
}

// Initialize all multi-page functionality
function initMultiPageFeatures() {
    updateActiveNav();
    initContactForm();
    initTabFunctionality();
    initSmoothScrolling();
    initSearchFunctionality();
    initScrollAnimations();
    addAnimationStyles();
    
    // Update stats counter for all pages
    if (typeof updateStats === 'function') {
        updateStats();
    }
}

// Loading Screen Functionality
function initLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    
    if (!loadingScreen) return;
    
    // Simulate loading time (you can adjust this based on your needs)
    const minLoadingTime = 2000; // Minimum 2 seconds
    const maxLoadingTime = 4000; // Maximum 4 seconds
    
    // Random loading time between min and max
    const loadingTime = Math.random() * (maxLoadingTime - minLoadingTime) + minLoadingTime;
    
    // Hide loading screen after specified time
    setTimeout(() => {
        hideLoadingScreen();
    }, loadingTime);
    
    // Also hide loading screen when page is fully loaded
    window.addEventListener('load', () => {
        // Add a small delay to ensure smooth transition
        setTimeout(() => {
            hideLoadingScreen();
        }, 500);
    });
    
    // Hide loading screen immediately if page is already loaded
    if (document.readyState === 'complete') {
        setTimeout(() => {
            hideLoadingScreen();
        }, 1000);
    }
}

function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    
    if (loadingScreen && !loadingScreen.classList.contains('fade-out')) {
        loadingScreen.classList.add('fade-out');
        
        // Remove loading screen from DOM after animation completes
        setTimeout(() => {
            if (loadingScreen.parentNode) {
                loadingScreen.parentNode.removeChild(loadingScreen);
            }
        }, 800); // Match the CSS transition duration
    }
}

// Enhanced loading with progress tracking
function initEnhancedLoading() {
    const loadingScreen = document.getElementById('loading-screen');
    const progressBar = document.querySelector('.loading-progress');
    const loadingText = document.querySelector('.loading-text');
    
    if (!loadingScreen || !progressBar || !loadingText) return;
    
    const loadingSteps = [
        { text: "Initializing...", progress: 20 },
        { text: "Loading Resources...", progress: 40 },
        { text: "Preparing Content...", progress: 60 },
        { text: "Optimizing Experience...", progress: 80 },
        { text: "Almost Ready...", progress: 95 },
        { text: "Welcome to SOET!", progress: 100 }
    ];
    
    let currentStep = 0;
    const stepDuration = 800; // Time for each step
    
    function updateProgress() {
        if (currentStep < loadingSteps.length) {
            const step = loadingSteps[currentStep];
            
            // Update text
            loadingText.textContent = step.text;
            
            // Update progress bar
            progressBar.style.width = step.progress + '%';
            
            currentStep++;
            
            // Continue to next step
            setTimeout(updateProgress, stepDuration);
        } else {
            // All steps complete, hide loading screen
            setTimeout(() => {
                hideLoadingScreen();
            }, 500);
        }
    }
    
    // Start progress updates after initial delay
    setTimeout(updateProgress, 1000);
}

// Preload critical resources
function preloadResources() {
    const criticalImages = [
        'IMG/Vikram-university_Logo.jpg',
        'IMG/College Pics/College/IMG-20241226-WA0008.jpg',
        'IMG/College Pics/College/IMG-20241226-WA0009.jpg',
        'IMG/College Pics/College/IMG-20241226-WA0010.jpg'
    ];
    
    const preloadPromises = criticalImages.map(src => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = resolve;
            img.onerror = resolve; // Don't fail loading for missing images
            img.src = src;
        });
    });
    
    Promise.all(preloadPromises).then(() => {
        // Resources preloaded, can proceed with hiding loading screen
        console.log('Critical resources preloaded');
    });
}

// Initialize loading screen based on user preference
function initLoadingBasedOnPreference() {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
        // For users who prefer reduced motion, show loading for shorter time
        setTimeout(() => {
            hideLoadingScreen();
        }, 1500);
    } else {
        // Full animation experience
        initEnhancedLoading();
    }
    
    // Start preloading resources
    preloadResources();
}

// Check if this is a page reload or fresh visit
function handlePageLoad() {
    const loadingScreen = document.getElementById('loading-screen');
    
    if (!loadingScreen) return;
    
    // Check if user has visited recently (within last 5 minutes)
    const lastVisit = localStorage.getItem('soet_last_visit');
    const now = Date.now();
    const fiveMinutes = 5 * 60 * 1000;
    
    if (lastVisit && (now - parseInt(lastVisit)) < fiveMinutes) {
        // Recent visit, show loading for shorter time
        setTimeout(() => {
            hideLoadingScreen();
        }, 1000);
    } else {
        // First visit or after long time, show full loading
        initLoadingBasedOnPreference();
    }
    
    // Update last visit time
    localStorage.setItem('soet_last_visit', now.toString());
}

// Call initialization when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', handlePageLoad);
} else {
    handlePageLoad();
}

// Faculty Filter Functionality
function showDepartment(department) {
    const facultyCards = document.querySelectorAll('.faculty-card');
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    // Remove active class from all tabs
    tabButtons.forEach(btn => btn.classList.remove('active'));
    
    // Add active class to clicked tab
    event.target.classList.add('active');
    
    // Filter faculty cards
    facultyCards.forEach(card => {
        if (department === 'all') {
            card.style.display = 'block';
            card.classList.add('visible');
        } else {
            const cardDept = card.getAttribute('data-dept');
            if (cardDept === department) {
                card.style.display = 'block';
                card.classList.add('visible');
            } else {
                card.style.display = 'none';
                card.classList.remove('visible');
            }
        }
    });
}

// Initialize faculty filter on page load
document.addEventListener('DOMContentLoaded', function() {
    if (document.querySelector('.faculty-tabs')) {
        showDepartment('all');
    }
});
