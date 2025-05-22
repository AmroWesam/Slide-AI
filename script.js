// Initialize AOS
document.addEventListener('DOMContentLoaded', function() {
    AOS.init({
        duration: 800,
        offset: 100,
        once: true
    });
});

// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }
});

// Navbar scroll effect
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Stats counter animation
document.addEventListener('DOMContentLoaded', function() {
    const stats = document.querySelectorAll('.stat-number');
    
    if (stats.length > 0) {
        stats.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-count'));
            let count = 0;
            const duration = 2000; // 2 seconds
            const increment = target / (duration / 16); // 60 FPS

            const updateCount = () => {
                if (count < target) {
                    count += increment;
                    stat.textContent = Math.ceil(count);
                    requestAnimationFrame(updateCount);
                } else {
                    stat.textContent = target;
                }
            };

            // Start animation when element is in view
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        updateCount();
                        observer.unobserve(entry.target);
                    }
                });
            });

            observer.observe(stat);
        });
    }
});

// Registration page specific code
document.addEventListener('DOMContentLoaded', function() {
    // Toggle between student and teacher registration
    const roleOptions = document.querySelectorAll('.role-option');
    const studentFields = document.querySelector('.student-fields');
    const teacherFields = document.querySelector('.teacher-fields');

    if (roleOptions.length > 0) {
        roleOptions.forEach(option => {
            option.addEventListener('click', () => {
                // Remove active class from all options
                roleOptions.forEach(opt => opt.classList.remove('active'));
                // Add active class to clicked option
                option.classList.add('active');

                // Show/hide relevant fields
                if (option.dataset.role === 'student') {
                    studentFields.classList.remove('hidden');
                    teacherFields.classList.add('hidden');
                } else {
                    studentFields.classList.add('hidden');
                    teacherFields.classList.remove('hidden');
                }
            });
        });
    }

    // Password visibility toggle
    const togglePassword = document.querySelectorAll('.toggle-password');
    if (togglePassword.length > 0) {
        togglePassword.forEach(toggle => {
            toggle.addEventListener('click', function(e) {
                e.preventDefault();
                const passwordInput = this.previousElementSibling;
                const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
                passwordInput.setAttribute('type', type);
                this.classList.toggle('fa-eye');
                this.classList.toggle('fa-eye-slash');
            });

            // Handle keyboard interaction for password toggle
            toggle.addEventListener('keypress', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
            });
        });
    }
});

// Login page specific code
document.addEventListener('DOMContentLoaded', function() {
    // Password visibility toggle
    const togglePassword = document.querySelectorAll('.toggle-password');
    if (togglePassword.length > 0) {
        togglePassword.forEach(toggle => {
            toggle.addEventListener('click', function(e) {
                e.preventDefault();
                const passwordInput = this.previousElementSibling;
                const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
                passwordInput.setAttribute('type', type);
                this.classList.toggle('fa-eye');
                this.classList.toggle('fa-eye-slash');
            });

            // Handle keyboard interaction for password toggle
            toggle.addEventListener('keypress', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
            });
        });
    }

    // Social login buttons
    const socialButtons = document.querySelectorAll('.social-btn');
    if (socialButtons.length > 0) {
        socialButtons.forEach(button => {
            button.addEventListener('click', function() {
                const provider = this.classList.contains('facebook') ? 'Facebook' :
                               this.classList.contains('google') ? 'Google' :
                               'Twitter';
                console.log(`Login with ${provider}`);
                // Add your social login logic here
            });
        });
    }
});

// Login Form Validation and Handling
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const togglePassword = document.querySelector('.toggle-password');

    // Toggle password visibility
    if (togglePassword) {
        togglePassword.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    }

    // Real-time email validation
    emailInput.addEventListener('input', () => {
        if (emailInput.value.length > 0) {
            if (!validateEmail(emailInput.value)) {
                showError(emailInput, 'Please enter a valid email address');
            } else {
                clearError(emailInput);
            }
        } else {
            clearError(emailInput);
        }
    });

    // Real-time password validation
    passwordInput.addEventListener('input', () => {
        if (passwordInput.value.length > 0 && passwordInput.value.length < 8) {
            showError(passwordInput, 'Password must be at least 8 characters long');
        } else {
            clearError(passwordInput);
        }
    });

    // Validate email
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email.toLowerCase());
    }

    // Show error message
    function showError(input, message) {
        const inputGroup = input.closest('.input-group');
        const errorElement = inputGroup.querySelector('.error-message');
        inputGroup.classList.add('error');
        errorElement.textContent = message;
    }

    // Clear error message
    function clearError(input) {
        const inputGroup = input.closest('.input-group');
        const errorElement = inputGroup.querySelector('.error-message');
        inputGroup.classList.remove('error');
        errorElement.textContent = '';
    }

    // Form submission
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        let isValid = true;

        // Validate email
        if (!emailInput.value) {
            showError(emailInput, 'Email is required');
            isValid = false;
        } else if (!validateEmail(emailInput.value)) {
            showError(emailInput, 'Please enter a valid email address');
            isValid = false;
        }

        // Validate password
        if (!passwordInput.value) {
            showError(passwordInput, 'Password is required');
            isValid = false;
        } else if (passwordInput.value.length < 8) {
            showError(passwordInput, 'Password must be at least 8 characters long');
            isValid = false;
        }

        if (isValid) {
            const submitButton = loginForm.querySelector('.login-btn');
            const btnText = submitButton.querySelector('.btn-text');
            
            // Show loading state
            submitButton.classList.add('loading');
            btnText.textContent = 'Logging in...';
            submitButton.disabled = true;

            try {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                // Redirect to dashboard
                window.location.href = 'index.html';
            } catch (error) {
                showError(emailInput, 'Login failed. Please try again.');
                submitButton.classList.remove('loading');
                btnText.textContent = 'Login';
                submitButton.disabled = false;
            }
        }
    });
});
