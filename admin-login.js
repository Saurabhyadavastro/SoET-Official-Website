// Admin Login JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const loginForm = document.getElementById('loginForm');
    const usernameField = document.getElementById('username');
    const passwordField = document.getElementById('password');
    const passwordToggle = document.querySelector('.toggle-password');
    const loginBtn = document.querySelector('.login-btn');
    const forgotPasswordLink = document.querySelector('.forgot-password');
    const rememberMeCheckbox = document.getElementById('rememberMe');

    // Admin credentials (In production, this should be handled server-side)
    const adminCredentials = {
        'admin': 'soet2024',
        'soetadmin': 'vikram@123',
        'principal': 'principal@soet',
        'dean': 'dean@2024'
    };

    // Password toggle functionality
    function togglePassword() {
        const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordField.setAttribute('type', type);
        
        const icon = document.getElementById('toggleIcon');
        if (type === 'text') {
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    }

    // Make togglePassword globally available
    window.togglePassword = togglePassword;

    // Form validation
    function validateForm() {
        let isValid = true;
        
        // Clear previous messages
        clearMessages();
        
        // Validate username
        if (!usernameField.value.trim()) {
            showError('Username is required');
            isValid = false;
        } else if (usernameField.value.length < 3) {
            showError('Username must be at least 3 characters');
            isValid = false;
        }
        
        // Validate password
        if (!passwordField.value) {
            showError('Password is required');
            isValid = false;
        } else if (passwordField.value.length < 6) {
            showError('Password must be at least 6 characters');
            isValid = false;
        }
        
        return isValid;
    }

    // Show error message
    function showError(message) {
        const errorElement = document.getElementById('errorMessage');
        const errorText = document.getElementById('errorText');
        errorText.textContent = message;
        errorElement.style.display = 'flex';
        
        // Hide after 5 seconds
        setTimeout(() => {
            errorElement.style.display = 'none';
        }, 5000);
    }

    // Show success message
    function showSuccess(message) {
        const successElement = document.getElementById('successMessage');
        const successText = document.getElementById('successText');
        successText.textContent = message;
        successElement.style.display = 'flex';
        
        // Hide after 3 seconds and redirect
        setTimeout(() => {
            successElement.style.display = 'none';
            window.location.href = 'admin-dashboard.html';
        }, 2000);
    }

    // Clear all messages
    function clearMessages() {
        document.getElementById('errorMessage').style.display = 'none';
        document.getElementById('successMessage').style.display = 'none';
    }

    // Simulate loading state
    function setLoadingState(isLoading) {
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (isLoading) {
            loadingOverlay.style.display = 'flex';
            loginBtn.disabled = true;
        } else {
            loadingOverlay.style.display = 'none';
            loginBtn.disabled = false;
        }
    }

    // Store login session
    function storeSession(username, rememberMe) {
        const sessionData = {
            username: username,
            loginTime: new Date().toISOString(),
            isAdmin: true
        };
        
        if (rememberMe) {
            // Store for 30 days
            const expiryDate = new Date();
            expiryDate.setDate(expiryDate.getDate() + 30);
            sessionData.expiry = expiryDate.toISOString();
            localStorage.setItem('soetAdminSession', JSON.stringify(sessionData));
        } else {
            // Store for session only
            sessionStorage.setItem('soetAdminSession', JSON.stringify(sessionData));
        }
    }

    // Check existing session
    function checkExistingSession() {
        const localSession = localStorage.getItem('soetAdminSession');
        const sessionSession = sessionStorage.getItem('soetAdminSession');
        
        if (localSession) {
            const sessionData = JSON.parse(localSession);
            if (sessionData.expiry && new Date(sessionData.expiry) > new Date()) {
                showSuccess('Welcome back! Redirecting to dashboard...');
                return;
            } else {
                localStorage.removeItem('soetAdminSession');
            }
        }
        
        if (sessionSession) {
            showSuccess('Welcome back! Redirecting to dashboard...');
            return;
        }
    }

    // Form submission
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        setLoadingState(true);
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const username = usernameField.value.trim();
        const password = passwordField.value;
        const rememberMe = rememberMeCheckbox.checked;
        
        // Check credentials
        if (adminCredentials[username] && adminCredentials[username] === password) {
            // Successful login
            storeSession(username, rememberMe);
            setLoadingState(false);
            showSuccess('Login successful! Redirecting to dashboard...');
        } else {
            // Failed login
            setLoadingState(false);
            showError('Invalid username or password. Please try again.');
            
            // Add shake animation to form
            loginForm.style.animation = 'shake 0.5s ease-in-out';
            setTimeout(() => {
                loginForm.style.animation = '';
            }, 500);
        }
    });

    // Forgot password functionality
    function showForgotPassword() {
        document.getElementById('forgotPasswordModal').style.display = 'flex';
    }
    
    function closeForgotPassword() {
        document.getElementById('forgotPasswordModal').style.display = 'none';
    }
    
    // Make functions globally available
    window.showForgotPassword = showForgotPassword;
    window.closeForgotPassword = closeForgotPassword;

    // Create forgot password modal
    function createForgotPasswordModal() {
        const modal = document.createElement('div');
        modal.className = 'forgot-password-modal';
        modal.innerHTML = `
            <div class="modal-overlay">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3><i class="fas fa-key"></i> Password Recovery</h3>
                        <button class="modal-close" onclick="this.closest('.forgot-password-modal').remove()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <p>For password recovery, please contact the system administrator:</p>
                        <div class="contact-info">
                            <p><i class="fas fa-envelope"></i> soet@vikramuniv.ac.in</p>
                            <p><i class="fas fa-phone"></i> +91 734-2514271</p>
                        </div>
                        <p class="note">Please provide your username and valid identification for verification.</p>
                    </div>
                    <div class="modal-footer">
                        <button class="btn-secondary" onclick="this.closest('.forgot-password-modal').remove()">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        // Add modal styles
        const style = document.createElement('style');
        style.textContent = `
            .forgot-password-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 9999;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
            }
            
            .forgot-password-modal.show {
                opacity: 1;
                visibility: visible;
            }
            
            .modal-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 20px;
            }
            
            .modal-content {
                background: white;
                border-radius: 15px;
                max-width: 400px;
                width: 100%;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                transform: scale(0.9);
                transition: transform 0.3s ease;
            }
            
            .forgot-password-modal.show .modal-content {
                transform: scale(1);
            }
            
            .modal-header {
                padding: 20px 25px 10px;
                border-bottom: 1px solid #eee;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .modal-header h3 {
                color: var(--primary-blue);
                margin: 0;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            
            .modal-close {
                background: none;
                border: none;
                font-size: 1.2rem;
                color: #666;
                cursor: pointer;
                padding: 5px;
                border-radius: 50%;
                transition: all 0.3s ease;
            }
            
            .modal-close:hover {
                background: #f0f0f0;
                color: #333;
            }
            
            .modal-body {
                padding: 20px 25px;
            }
            
            .contact-info {
                background: #f8f9fa;
                padding: 15px;
                border-radius: 8px;
                margin: 15px 0;
            }
            
            .contact-info p {
                margin: 8px 0;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            
            .note {
                font-size: 0.85rem;
                color: #666;
                font-style: italic;
            }
            
            .modal-footer {
                padding: 10px 25px 20px;
                text-align: right;
            }
            
            .btn-secondary {
                background: #6c757d;
                color: white;
                border: none;
                padding: 8px 20px;
                border-radius: 6px;
                cursor: pointer;
                transition: background 0.3s ease;
            }
            
            .btn-secondary:hover {
                background: #5a6268;
            }
        `;
        
        document.head.appendChild(style);
        return modal;
    }

    // Add shake animation styles
    const shakeStyle = document.createElement('style');
    shakeStyle.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
    `;
    document.head.appendChild(shakeStyle);

    // Check for existing session on page load
    checkExistingSession();

    // Auto-focus username field
    usernameField.focus();

    // Enter key handling
    usernameField.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            passwordField.focus();
        }
    });

    console.log('Admin Login System Initialized');
    console.log('Demo Credentials:');
    console.log('Username: admin, Password: soet2024');
    console.log('Username: soetadmin, Password: vikram@123');
});
