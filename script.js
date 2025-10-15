// JavaScript for AGEIS SUPPORT Website

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
});

// Initialize all website functionality
function initializeWebsite() {
    setupMobileMenu();
    setupAccessibilityControls();
    setupTestimonialCarousel();
    setupScrollAnimations();
    setupFormValidation();
    setupVoiceAssistance();
}

// Mobile Menu Toggle
function setupMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
}

// Accessibility Controls
function setupAccessibilityControls() {
    // Font Size Controls
    const fontIncrease = document.getElementById('fontIncrease');
    const fontDecrease = document.getElementById('fontDecrease');
    
    if (fontIncrease) {
        fontIncrease.addEventListener('click', function() {
            const body = document.body;
            if (body.classList.contains('large-font')) {
                body.classList.remove('large-font');
                body.classList.add('larger-font');
            } else if (body.classList.contains('larger-font')) {
                body.classList.remove('larger-font');
                body.classList.add('largest-font');
            } else {
                body.classList.add('large-font');
            }
        });
    }

    if (fontDecrease) {
        fontDecrease.addEventListener('click', function() {
            const body = document.body;
            if (body.classList.contains('largest-font')) {
                body.classList.remove('largest-font');
                body.classList.add('larger-font');
            } else if (body.classList.contains('larger-font')) {
                body.classList.remove('larger-font');
                body.classList.add('large-font');
            } else if (body.classList.contains('large-font')) {
                body.classList.remove('large-font');
            }
        });
    }

    // High Contrast Toggle
    const highContrast = document.getElementById('highContrast');
    if (highContrast) {
        highContrast.addEventListener('click', function() {
            document.body.classList.toggle('high-contrast');
            // Save preference to localStorage
            const isHighContrast = document.body.classList.contains('high-contrast');
            localStorage.setItem('highContrast', isHighContrast);
        });

        // Load saved preference
        const savedHighContrast = localStorage.getItem('highContrast');
        if (savedHighContrast === 'true') {
            document.body.classList.add('high-contrast');
        }
    }
}

// Testimonial Carousel
let currentTestimonial = 0;
const testimonials = document.querySelectorAll('.testimonial');

function setupTestimonialCarousel() {
    if (testimonials.length === 0) return;

    // Auto-rotate testimonials every 5 seconds
    setInterval(() => {
        changeTestimonial(1);
    }, 5000);
}

function changeTestimonial(direction) {
    testimonials[currentTestimonial].classList.remove('active');
    
    currentTestimonial += direction;
    
    if (currentTestimonial >= testimonials.length) {
        currentTestimonial = 0;
    } else if (currentTestimonial < 0) {
        currentTestimonial = testimonials.length - 1;
    }
    
    testimonials[currentTestimonial].classList.add('active');
}

// Scroll Animations
function setupScrollAnimations() {
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

    // Observe all elements with fade-in class
    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });

    // Add fade-in class to cards and sections
    document.querySelectorAll('.help-card, .service-card, .support-card, .step').forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
}

// Form Validation
function setupFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateForm(form)) {
                handleFormSubmission(form);
            }
        });
    });
}

function validateForm(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            showFieldError(field, 'This field is required');
            isValid = false;
        } else {
            clearFieldError(field);
        }
        
        // Email validation
        if (field.type === 'email' && field.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(field.value)) {
                showFieldError(field, 'Please enter a valid email address');
                isValid = false;
            }
        }
        
        // Phone validation
        if (field.type === 'tel' && field.value) {
            const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
            if (!phoneRegex.test(field.value)) {
                showFieldError(field, 'Please enter a valid phone number');
                isValid = false;
            }
        }
    });
    
    return isValid;
}

function showFieldError(field, message) {
    clearFieldError(field);
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.color = '#e74c3c';
    errorDiv.style.fontSize = '0.9rem';
    errorDiv.style.marginTop = '0.25rem';
    
    field.parentNode.appendChild(errorDiv);
    field.style.borderColor = '#e74c3c';
}

function clearFieldError(field) {
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    field.style.borderColor = '';
}

// Form Submission Handler
function handleFormSubmission(form) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Submitting...';
    submitBtn.disabled = true;
    
    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
        // Reset form
        form.reset();
        
        // Show success message
        showNotification('Thank you! Your request has been submitted successfully. We will contact you soon.', 'success');
        
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // Send email notification (simulated)
        sendEmailNotification(data);
        
    }, 2000);
}

// Email Notification (Simulated)
function sendEmailNotification(data) {
    console.log('Email notification would be sent with data:', data);
    
    // In a real implementation, this would send data to a backend service
    // that handles email notifications using services like:
    // - EmailJS
    // - SendGrid
    // - AWS SES
    // - Node.js with Nodemailer
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#27ae60' : '#3498db'};
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 10000;
        max-width: 400px;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

// Voice Assistance
function setupVoiceAssistance() {
    const voiceAssistBtn = document.getElementById('voiceAssist');
    
    if (voiceAssistBtn && 'speechSynthesis' in window) {
        voiceAssistBtn.addEventListener('click', function() {
            if (speechSynthesis.speaking) {
                speechSynthesis.cancel();
                voiceAssistBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
            } else {
                readPageContent();
                voiceAssistBtn.innerHTML = '<i class="fas fa-stop"></i>';
            }
        });
    }
}

function readPageContent() {
    const mainContent = document.querySelector('main') || document.body;
    const textToRead = extractTextContent(mainContent);
    
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.rate = 0.8;
    utterance.pitch = 1;
    utterance.volume = 0.8;
    
    utterance.onend = function() {
        document.getElementById('voiceAssist').innerHTML = '<i class="fas fa-volume-up"></i>';
    };
    
    speechSynthesis.speak(utterance);
}

function extractTextContent(element) {
    let text = '';
    
    // Skip script and style elements
    if (element.tagName === 'SCRIPT' || element.tagName === 'STYLE') {
        return '';
    }
    
    // Get text content
    if (element.nodeType === Node.TEXT_NODE) {
        text += element.textContent + ' ';
    } else {
        for (let child of element.childNodes) {
            text += extractTextContent(child);
        }
    }
    
    return text;
}

// Smooth Scrolling for Anchor Links
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

// Keyboard Navigation Support
document.addEventListener('keydown', function(e) {
    // ESC key closes mobile menu
    if (e.key === 'Escape') {
        const navMenu = document.querySelector('.nav-menu');
        const hamburger = document.querySelector('.hamburger');
        if (navMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        }
    }
    
    // Tab navigation enhancement
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
    }
});

// Remove keyboard navigation class on mouse use
document.addEventListener('mousedown', function() {
    document.body.classList.remove('keyboard-navigation');
});

// Add CSS for keyboard navigation
const keyboardCSS = `
.keyboard-navigation *:focus {
    outline: 2px solid var(--primary-color) !important;
    outline-offset: 2px !important;
}
`;

const style = document.createElement('style');
style.textContent = keyboardCSS;
document.head.appendChild(style);

// Add CSS animations
const animationCSS = `
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

@keyframes slideOutRight {
    from {
        transform: translateX(0);
        opacity: 1;
    }
    to {
        transform: translateX(100%);
        opacity: 0;
    }
}
`;

const animationStyle = document.createElement('style');
animationStyle.textContent = animationCSS;
document.head.appendChild(animationStyle);

// Service Filtering (for Services page)
function filterServices(category) {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
            card.style.display = 'block';
            card.classList.add('fade-in');
        } else {
            card.style.display = 'none';
        }
    });
}

// FAQ Toggle (for Contact page)
function setupFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            // Close other FAQ items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });
}

// Service Filter Setup
function setupServiceFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Filter services
            const category = this.dataset.category;
            filterServices(category);
        });
    });
}

// Mobile Navigation Toggle
function setupMobileNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            }
        });
    }
}

// Initialize mobile navigation
document.addEventListener('DOMContentLoaded', function() {
    setupMobileNavigation();
    
    // Initialize FAQ if on contact page
    if (document.querySelector('.faq-item')) {
        setupFAQ();
    }
    
    // Initialize service filter if on services page
    if (document.querySelector('.filter-btn')) {
        setupServiceFilter();
    }
});

// Emergency Contact Handler
function showEmergencyContacts() {
    const emergencyInfo = `
        <div class="emergency-modal">
            <h3>Emergency Contacts</h3>
            <ul>
                <li><strong>Lifeline:</strong> 13 11 14</li>
                <li><strong>Beyond Blue:</strong> 1300 22 4636</li>
                <li><strong>Emergency Services:</strong> 000</li>
                <li><strong>Suicide Call Back Service:</strong> 1300 659 467</li>
            </ul>
            <button onclick="closeEmergencyModal()" class="btn btn-primary">Close</button>
        </div>
    `;
    
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = emergencyInfo;
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
    `;
    
    document.body.appendChild(modal);
}

function closeEmergencyModal() {
    const modal = document.querySelector('.modal-overlay');
    if (modal) {
        modal.remove();
    }
}

// Export functions for global access
window.changeTestimonial = changeTestimonial;
window.filterServices = filterServices;
window.showEmergencyContacts = showEmergencyContacts;
window.closeEmergencyModal = closeEmergencyModal;
