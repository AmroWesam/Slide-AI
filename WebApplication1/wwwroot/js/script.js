// Initialize AOS
document.addEventListener('DOMContentLoaded', function() {
    AOS.init({
        duration: 800,
        offset: 100,
        once: true
    });
    
    // Initialize steps animation in How It Works section
    initHowItWorksAnimation();
    
    // Initialize sample cards interaction
    initSampleCards();
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
    // User profile initialization
    const profileFields = document.querySelector('.user-profile-fields');
    const presentationGoals = document.getElementById('presentationGoals');
    
    if (presentationGoals) {
        // Update field visibility based on selected goals if needed
        presentationGoals.addEventListener('change', () => {
            // Additional customization logic can be added here
            // For example, showing different tips based on presentation goals
            console.log('Selected goal:', presentationGoals.value);
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

    // How It Works Animation Function
function initHowItWorksAnimation() {
    const stepCards = document.querySelectorAll('.step-card');
    const stepConnectors = document.querySelectorAll('.step-connector');
    const stepsContainer = document.querySelector('.steps-container');
    
    if (stepCards.length === 0) return;
    
    // Add AOS animation to steps container
    if (stepsContainer) {
        stepsContainer.setAttribute('data-aos', 'fade-up');
        stepsContainer.setAttribute('data-aos-duration', '800');
    }
    
    // Add staggered animation delay to step cards
    stepCards.forEach((card, index) => {
        // Set AOS attributes
        card.setAttribute('data-aos', 'fade-up');
        card.setAttribute('data-aos-delay', (index * 150).toString());
        card.setAttribute('data-aos-duration', '800');
        
        // Add hover interaction
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
            this.style.boxShadow = '0 20px 40px rgba(0,0,0,0.12)';
            
            // Animate the step number
            const stepNumber = this.querySelector('.step-number');
            if (stepNumber) {
                stepNumber.style.transform = 'scale(1.1)';
                stepNumber.style.boxShadow = '0 10px 25px rgba(59, 130, 246, 0.4)';
            }
            
            // Animate the step icon
            const stepIcon = this.querySelector('.step-icon');
            if (stepIcon) {
                stepIcon.style.transform = 'scale(1.1)';
                stepIcon.style.backgroundColor = 'rgba(59, 130, 246, 0.15)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.boxShadow = '';
            
            // Reset animations
            const stepNumber = this.querySelector('.step-number');
            if (stepNumber) {
                stepNumber.style.transform = '';
                stepNumber.style.boxShadow = '';
            }
            
            const stepIcon = this.querySelector('.step-icon');
            if (stepIcon) {
                stepIcon.style.transform = '';
                stepIcon.style.backgroundColor = '';
            }
        });
    });
    
    // Add animation to connectors
    stepConnectors.forEach((connector, index) => {
        connector.setAttribute('data-aos', 'fade-up');
        connector.setAttribute('data-aos-delay', ((index + 1) * 150).toString());
        connector.setAttribute('data-aos-duration', '600');
    });
}

// Sample Cards Interaction
function initSampleCards() {
    const sampleCards = document.querySelectorAll('.sample-card');
    const samplesSection = document.querySelector('.samples-section');
    
    if (sampleCards.length === 0) return;
    
    // Add AOS to section header
    if (samplesSection) {
        const sectionHeader = samplesSection.querySelector('.section-header');
        if (sectionHeader) {
            sectionHeader.setAttribute('data-aos', 'fade-up');
            sectionHeader.setAttribute('data-aos-duration', '800');
        }
    }
    
    // Initialize counter for staggered animations
    let delayCounter = 0;
    
    sampleCards.forEach((card, index) => {
        // Set AOS attributes with staggered delay
        card.setAttribute('data-aos', 'fade-up');
        card.setAttribute('data-aos-delay', (index * 150).toString());
        card.setAttribute('data-aos-duration', '800');
        
        // Get sample preview image and overlay
        const preview = card.querySelector('.sample-preview');
        const overlay = card.querySelector('.sample-overlay');
        const sampleInfo = card.querySelector('.sample-info');
        
        if (!preview || !overlay) return;
        
        // Add hover interactions for smooth animations
        card.addEventListener('mouseenter', function() {
            // Animate overlay
            if (overlay) {
                overlay.style.opacity = '1';
                overlay.style.transform = 'translateY(0)';
            }
            
            // Animate image
            const img = preview.querySelector('img');
            if (img) {
                img.style.transform = 'scale(1.1) rotate(2deg)';
                img.style.filter = 'drop-shadow(0 15px 20px rgba(0, 0, 0, 0.15))';
            }
            
            // Animate card
            this.style.transform = 'translateY(-10px)';
            this.style.boxShadow = '0 20px 40px rgba(0,0,0,0.12)';
            
            // Animate sample info
            if (sampleInfo) {
                const title = sampleInfo.querySelector('h3');
                if (title) {
                    title.style.color = 'var(--primary-color)';
                }
            }
        });
        
        card.addEventListener('mouseleave', function() {
            // Reset overlay
            if (overlay) {
                overlay.style.opacity = '';
                overlay.style.transform = '';
            }
            
            // Reset image
            const img = preview.querySelector('img');
            if (img) {
                img.style.transform = '';
                img.style.filter = '';
            }
            
            // Reset card
            this.style.transform = '';
            this.style.boxShadow = '';
            
            // Reset sample info
            if (sampleInfo) {
                const title = sampleInfo.querySelector('h3');
                if (title) {
                    title.style.color = '';
                }
            }
        });
        
        // Add a slight animation to rating stars
        const ratingStars = card.querySelector('.rating-stars');
        if (ratingStars) {
            ratingStars.style.transition = 'all 0.3s ease';
            
            card.addEventListener('mouseenter', function() {
                ratingStars.style.transform = 'scale(1.1)';
                ratingStars.style.textShadow = '0 4px 8px rgba(245, 158, 11, 0.3)';
            });
            
            card.addEventListener('mouseleave', function() {
                ratingStars.style.transform = '';
                ratingStars.style.textShadow = '';
            });
        }
    });
    
    // Add a scroll animation to CTA container
    const ctaContainer = samplesSection ? samplesSection.querySelector('.cta-container') : null;
    if (ctaContainer) {
        ctaContainer.setAttribute('data-aos', 'zoom-in');
        ctaContainer.setAttribute('data-aos-delay', '300');
        ctaContainer.setAttribute('data-aos-duration', '800');
    }
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
