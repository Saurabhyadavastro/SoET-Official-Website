// Announcements Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeFilters();
    initializeSearch();
    initializeNewsletterForm();
    loadDynamicAnnouncements();
    initializeLoadMore();
    addScrollAnimations();
});

// Filter functionality
function initializeFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const announcementCards = document.querySelectorAll('.announcement-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-filter');
            
            // Filter announcements with animation
            announcementCards.forEach((card, index) => {
                setTimeout(() => {
                    if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                        card.style.display = 'block';
                        card.style.animation = 'fadeInUp 0.5s ease-out forwards';
                    } else {
                        card.style.animation = 'fadeOut 0.3s ease-out forwards';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                }, index * 50);
            });
        });
    });
}

// Search functionality
function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    const announcementCards = document.querySelectorAll('.announcement-card');
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            
            announcementCards.forEach(card => {
                const title = card.querySelector('h3').textContent.toLowerCase();
                const content = card.querySelector('p').textContent.toLowerCase();
                const category = card.querySelector('.category').textContent.toLowerCase();
                
                if (title.includes(searchTerm) || content.includes(searchTerm) || category.includes(searchTerm)) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeInUp 0.3s ease-out forwards';
                } else {
                    card.style.animation = 'fadeOut 0.3s ease-out forwards';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    }
}

// Newsletter form functionality
function initializeNewsletterForm() {
    const form = document.getElementById('newsletterForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = this.querySelector('input[type="email"]').value;
            if (email) {
                showNotification('Thank you for subscribing! You will receive updates at ' + email, 'success');
                this.querySelector('input[type="email"]').value = '';
                
                // Add to localStorage (in real app, this would go to server)
                const subscribers = JSON.parse(localStorage.getItem('newsletterSubscribers') || '[]');
                subscribers.push({
                    email: email,
                    date: new Date().toISOString()
                });
                localStorage.setItem('newsletterSubscribers', JSON.stringify(subscribers));
            }
        });
    }
}

// Load dynamic announcements from admin system
function loadDynamicAnnouncements() {
    const announcements = JSON.parse(localStorage.getItem('soetAnnouncements') || '[]');
    
    if (announcements.length > 0) {
        const grid = document.getElementById('announcementsGrid');
        
        announcements.forEach(announcement => {
            if (announcement.status === 'published') {
                const announcementCard = createAnnouncementCard(announcement);
                grid.insertBefore(announcementCard, grid.firstChild);
            }
        });
    }
}

// Create announcement card from data
function createAnnouncementCard(announcement) {
    const card = document.createElement('div');
    card.className = 'announcement-card';
    card.setAttribute('data-category', announcement.priority || 'general');
    
    const categoryClass = announcement.priority || 'general';
    const iconClass = getCategoryIcon(categoryClass);
    
    card.innerHTML = `
        <div class="announcement-header">
            <div class="announcement-icon ${categoryClass}">
                <i class="${iconClass}"></i>
            </div>
            <div class="announcement-meta">
                <span class="category ${categoryClass}">${announcement.priority.charAt(0).toUpperCase() + announcement.priority.slice(1)}</span>
                <span class="date">${formatDate(announcement.timestamp)}</span>
            </div>
        </div>
        <div class="announcement-content">
            <h3>${announcement.title}</h3>
            <p>${announcement.content}</p>
            <div class="announcement-details">
                <span><i class="fas fa-clock"></i> ${getTimeAgo(announcement.timestamp)}</span>
                <span><i class="fas fa-tag"></i> ${announcement.priority}</span>
            </div>
            <a href="#" class="read-more">
                Read More <i class="fas fa-arrow-right"></i>
            </a>
        </div>
    `;
    
    return card;
}

// Get category icon
function getCategoryIcon(category) {
    const icons = {
        academic: 'fas fa-graduation-cap',
        events: 'fas fa-calendar-alt',
        admissions: 'fas fa-user-plus',
        results: 'fas fa-file-alt',
        urgent: 'fas fa-exclamation-triangle',
        high: 'fas fa-bullhorn',
        medium: 'fas fa-info-circle',
        low: 'fas fa-info'
    };
    return icons[category] || 'fas fa-info-circle';
}

// Format date for display
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Get time ago
function getTimeAgo(dateString) {
    const now = new Date();
    const date = new Date(dateString);
    const diff = now - date;
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'Just now';
}

// Initialize load more functionality
function initializeLoadMore() {
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    let currentlyShowing = 6;
    const allCards = document.querySelectorAll('.announcement-card');
    
    // Initially show only first 6 cards
    allCards.forEach((card, index) => {
        if (index >= currentlyShowing) {
            card.style.display = 'none';
        }
    });
    
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            const hiddenCards = Array.from(allCards).slice(currentlyShowing, currentlyShowing + 3);
            
            hiddenCards.forEach((card, index) => {
                setTimeout(() => {
                    card.style.display = 'block';
                    card.style.animation = 'fadeInUp 0.5s ease-out forwards';
                }, index * 100);
            });
            
            currentlyShowing += 3;
            
            if (currentlyShowing >= allCards.length) {
                loadMoreBtn.style.display = 'none';
            }
        });
    }
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Add notification styles if not exists
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 1001;
                min-width: 300px;
                border-radius: 8px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
                animation: slideInRight 0.3s ease-out;
            }
            
            .notification-success {
                background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
                border: 1px solid #c3e6cb;
                color: #155724;
            }
            
            .notification-error {
                background: linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%);
                border: 1px solid #f5c6cb;
                color: #721c24;
            }
            
            .notification-info {
                background: linear-gradient(135deg, #d1ecf1 0%, #bee5eb 100%);
                border: 1px solid #bee5eb;
                color: #0c5460;
            }
            
            .notification-content {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 15px 20px;
            }
            
            .notification-close {
                background: none;
                border: none;
                cursor: pointer;
                opacity: 0.7;
                font-size: 16px;
                padding: 5px;
                border-radius: 50%;
                transition: all 0.3s ease;
            }
            
            .notification-close:hover {
                opacity: 1;
                background: rgba(0, 0, 0, 0.1);
            }
            
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            @keyframes fadeOut {
                from {
                    opacity: 1;
                    transform: scale(1);
                }
                to {
                    opacity: 0;
                    transform: scale(0.95);
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'fadeOut 0.3s ease-out forwards';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Add scroll animations
function addScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
            }
        });
    }, observerOptions);
    
    // Observe announcement cards and notices
    document.querySelectorAll('.announcement-card, .notice-card').forEach(card => {
        observer.observe(card);
    });
}

console.log('Announcements page initialized successfully');
