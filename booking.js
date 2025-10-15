// Booking System JavaScript for AGEIS SUPPORT

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing booking system...');
    initializeBookingSystem();
});

function initializeBookingSystem() {
    console.log('Initializing booking system...');
    
    // Wait a bit to ensure DOM is fully ready
    setTimeout(() => {
        setupBookingSteps();
        setupFormValidation();
        setupDatePicker();
        setupFormNavigation();
        console.log('Booking system initialized successfully');
    }, 100);
}

// Booking Steps Management
function setupBookingSteps() {
    console.log('Setting up booking steps...'); // Debug log
    
    const stepIndicators = document.querySelectorAll('.step-indicator');
    const formSteps = document.querySelectorAll('.form-step');
    
    console.log('Found step indicators:', stepIndicators.length); // Debug log
    console.log('Found form steps:', formSteps.length); // Debug log
    
    // Set minimum date to today
    const dateInput = document.getElementById('preferredDate');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
        console.log('Set minimum date to:', today); // Debug log
    }
}

// Form Navigation
function setupFormNavigation() {
    const nextButtons = document.querySelectorAll('.next-step');
    const prevButtons = document.querySelectorAll('.prev-step');
    
    console.log('Found next buttons:', nextButtons.length); // Debug log
    console.log('Found prev buttons:', prevButtons.length); // Debug log
    
    nextButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Next button clicked, target step:', this.dataset.next); // Debug log
            const nextStep = this.dataset.next;
            if (validateCurrentStep()) {
                goToStep(nextStep);
            } else {
                console.log('Validation failed, not proceeding to next step'); // Debug log
            }
        });
    });
    
    prevButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Prev button clicked, target step:', this.dataset.prev); // Debug log
            const prevStep = this.dataset.prev;
            goToStep(prevStep);
        });
    });
}

// Step Navigation
function goToStep(stepNumber) {
    console.log('=== GOING TO STEP:', stepNumber, '===');
    
    // Find all form steps
    const allSteps = document.querySelectorAll('.form-step');
    console.log('Total form steps found:', allSteps.length);
    
    // Hide all steps
    allSteps.forEach((step, index) => {
        console.log(`Step ${index + 1}:`, step.dataset.step, 'removing active class');
        step.classList.remove('active');
    });
    
    // Show target step
    const targetStep = document.querySelector(`[data-step="${stepNumber}"]`);
    if (targetStep) {
        targetStep.classList.add('active');
        console.log('Successfully showing step:', stepNumber);
        
        // Force a reflow to ensure the step is visible
        targetStep.offsetHeight;
    } else {
        console.error('ERROR: Target step not found for step number:', stepNumber);
        console.log('Available steps:', Array.from(allSteps).map(s => s.dataset.step));
    }
    
    // Update step indicators
    const stepIndicators = document.querySelectorAll('.step-indicator');
    stepIndicators.forEach(indicator => {
        indicator.classList.remove('active');
        if (parseInt(indicator.dataset.step) <= parseInt(stepNumber)) {
            indicator.classList.add('active');
        }
    });
    
    // Update summary on step 3
    if (stepNumber === '3') {
        updateBookingSummary();
    }
    
    // Scroll to top of form
    const formContainer = document.querySelector('.booking-form-container');
    if (formContainer) {
        formContainer.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
    
    console.log('=== STEP NAVIGATION COMPLETE ===');
}

// Validate Current Step
function validateCurrentStep() {
    const activeStep = document.querySelector('.form-step.active');
    const requiredFields = activeStep.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            showFieldError(field, 'This field is required');
            isValid = false;
        } else {
            clearFieldError(field);
        }
        
        // Additional validation
        if (field.type === 'email' && field.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(field.value)) {
                showFieldError(field, 'Please enter a valid email address');
                isValid = false;
            }
        }
        
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

// Update Booking Summary
function updateBookingSummary() {
    const formData = new FormData(document.getElementById('bookingForm'));
    
    // Update summary fields
    document.getElementById('summary-service').textContent = 
        getServiceDisplayName(formData.get('serviceType')) || 'Not specified';
    
    document.getElementById('summary-frequency').textContent = 
        getFrequencyDisplayName(formData.get('serviceFrequency')) || 'Not specified';
    
    document.getElementById('summary-date').textContent = 
        formData.get('preferredDate') || 'Not specified';
    
    document.getElementById('summary-time').textContent = 
        getTimeDisplayName(formData.get('preferredTime')) || 'Not specified';
    
    document.getElementById('summary-urgency').textContent = 
        getUrgencyDisplayName(formData.get('urgency')) || 'Standard';
    
    const firstName = formData.get('firstName') || '';
    const lastName = formData.get('lastName') || '';
    document.getElementById('summary-name').textContent = 
        `${firstName} ${lastName}`.trim() || 'Not specified';
    
    const email = formData.get('email') || '';
    const phone = formData.get('phone') || '';
    document.getElementById('summary-contact').textContent = 
        `${email} | ${phone}`.replace(' | ', '') || 'Not specified';
    
    document.getElementById('summary-funding').textContent = 
        getFundingDisplayName(formData.get('fundingOption')) || 'Not specified';
}

// Helper functions for display names
function getServiceDisplayName(value) {
    const serviceNames = {
        'home-cleaning': 'Home Cleaning',
        'meal-preparation': 'Meal Preparation',
        'home-maintenance': 'Home Maintenance',
        'shopping-assistance': 'Shopping Assistance',
        'personal-care': 'Personal Care',
        'medication-management': 'Medication Management',
        'mobility-assistance': 'Mobility Assistance',
        'nursing-care': 'Nursing Care',
        'wound-care': 'Wound Care',
        'health-monitoring': 'Health Monitoring',
        'medical-transport': 'Medical Transport',
        'social-transport': 'Social Transport',
        'shopping-transport': 'Shopping Transport',
        'counseling': 'Individual Counseling',
        'online-therapy': 'Online Therapy',
        'support-group': 'Support Group',
        'family-counseling': 'Family Counseling',
        'companionship': 'Companionship',
        'social-activities': 'Social Activities',
        'community-programs': 'Community Programs'
    };
    return serviceNames[value] || value;
}

function getFrequencyDisplayName(value) {
    const frequencyNames = {
        'one-time': 'One-time service',
        'weekly': 'Weekly',
        'fortnightly': 'Fortnightly',
        'monthly': 'Monthly',
        'as-needed': 'As needed'
    };
    return frequencyNames[value] || value;
}

function getTimeDisplayName(value) {
    const timeNames = {
        'morning': 'Morning (8AM - 12PM)',
        'afternoon': 'Afternoon (12PM - 5PM)',
        'evening': 'Evening (5PM - 8PM)',
        'flexible': 'Flexible'
    };
    return timeNames[value] || value;
}

function getUrgencyDisplayName(value) {
    const urgencyNames = {
        'standard': 'Standard (within 1-2 weeks)',
        'urgent': 'Urgent (within 3-5 days)',
        'emergency': 'Emergency (within 24 hours)'
    };
    return urgencyNames[value] || value;
}

function getFundingDisplayName(value) {
    const fundingNames = {
        'ndis': 'NDIS',
        'aged-care': 'Aged Care Package',
        'medicare': 'Medicare',
        'private-health': 'Private Health Insurance',
        'private-pay': 'Private Pay',
        'not-sure': 'Not Sure - Need Help'
    };
    return fundingNames[value] || value;
}

// Form Submission
function setupFormValidation() {
    const form = document.getElementById('bookingForm');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateBookingForm()) {
                submitBookingForm();
            }
        });
    }
}

function validateBookingForm() {
    const form = document.getElementById('bookingForm');
    let isValid = true;
    
    // Validate all required fields across all steps
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
    
    // Validate checkboxes
    const requiredCheckboxes = form.querySelectorAll('input[type="checkbox"][required]');
    requiredCheckboxes.forEach(checkbox => {
        if (!checkbox.checked) {
            showFieldError(checkbox, 'This agreement is required');
            isValid = false;
        } else {
            clearFieldError(checkbox);
        }
    });
    
    return isValid;
}

function submitBookingForm() {
    const form = document.getElementById('bookingForm');
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Submitting...';
    submitBtn.disabled = true;
    
    // Simulate form submission
    setTimeout(() => {
        // Reset form
        form.reset();
        
        // Show success message
        showBookingSuccess();
        
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // Send email notification (simulated)
        sendBookingNotification(data);
        
        // Reset to step 1
        goToStep('1');
        
    }, 2000);
}

function showBookingSuccess() {
    const successMessage = `
        <div class="booking-success">
            <div class="success-icon">
                <i class="fas fa-check-circle"></i>
            </div>
            <h2>Booking Request Submitted!</h2>
            <p>Thank you for choosing AGEIS SUPPORT. Your booking request has been submitted successfully.</p>
            <div class="success-details">
                <h3>What happens next?</h3>
                <ul>
                    <li>You'll receive a confirmation email within 24 hours</li>
                    <li>We'll match you with qualified service providers</li>
                    <li>Your assigned provider will contact you within 2-3 business days</li>
                    <li>Service delivery will begin as scheduled</li>
                </ul>
            </div>
            <div class="success-actions">
                <a href="index.html" class="btn btn-primary">Return to Home</a>
                <a href="contact.html" class="btn btn-secondary">Contact Support</a>
            </div>
        </div>
    `;
    
    const formContainer = document.querySelector('.booking-form-container');
    formContainer.innerHTML = successMessage;
    
    // Add success styles
    const style = document.createElement('style');
    style.textContent = `
        .booking-success {
            text-align: center;
            padding: 3rem 2rem;
            background: #f8f9fa;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        
        .success-icon {
            font-size: 4rem;
            color: #27ae60;
            margin-bottom: 1rem;
        }
        
        .booking-success h2 {
            font-family: 'Poppins', sans-serif;
            color: #333;
            margin-bottom: 1rem;
        }
        
        .booking-success p {
            color: #666;
            margin-bottom: 2rem;
            font-size: 1.1rem;
        }
        
        .success-details {
            background: white;
            padding: 2rem;
            border-radius: 8px;
            margin: 2rem 0;
            text-align: left;
        }
        
        .success-details h3 {
            font-family: 'Poppins', sans-serif;
            color: #0077B6;
            margin-bottom: 1rem;
        }
        
        .success-details ul {
            list-style: none;
            padding: 0;
        }
        
        .success-details li {
            padding: 0.5rem 0;
            color: #666;
            position: relative;
            padding-left: 1.5rem;
        }
        
        .success-details li::before {
            content: '✓';
            position: absolute;
            left: 0;
            color: #27ae60;
            font-weight: bold;
        }
        
        .success-actions {
            display: flex;
            gap: 1rem;
            justify-content: center;
            flex-wrap: wrap;
        }
    `;
    document.head.appendChild(style);
}

function sendBookingNotification(data) {
    console.log('Booking notification would be sent with data:', data);
    
    // In a real implementation, this would send data to a backend service
    // that handles email notifications using services like:
    // - EmailJS
    // - SendGrid
    // - AWS SES
    // - Node.js with Nodemailer
}

// Date Picker Setup
function setupDatePicker() {
    const dateInput = document.getElementById('preferredDate');
    if (dateInput) {
        // Set minimum date to today
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
        
        // Set maximum date to 6 months from now
        const maxDate = new Date();
        maxDate.setMonth(maxDate.getMonth() + 6);
        dateInput.max = maxDate.toISOString().split('T')[0];
    }
}

// Field Error Handling
function showFieldError(field, message) {
    clearFieldError(field);
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        color: #e74c3c;
        font-size: 0.9rem;
        margin-top: 0.25rem;
        display: block;
    `;
    
    field.parentNode.appendChild(errorDiv);
    field.style.borderColor = '#e74c3c';
    
    // Scroll to error field
    field.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function clearFieldError(field) {
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    field.style.borderColor = '';
}

// Auto-save form data
function autoSaveFormData() {
    const form = document.getElementById('bookingForm');
    if (form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        localStorage.setItem('ageisBookingData', JSON.stringify(data));
    }
}

// Load saved form data
function loadSavedFormData() {
    const savedData = localStorage.getItem('ageisBookingData');
    if (savedData) {
        try {
            const data = JSON.parse(savedData);
            Object.keys(data).forEach(key => {
                const field = form.querySelector(`[name="${key}"]`);
                if (field && data[key]) {
                    field.value = data[key];
                }
            });
        } catch (e) {
            console.error('Error loading saved form data:', e);
        }
    }
}

// Clear saved data on successful submission
function clearSavedFormData() {
    localStorage.removeItem('ageisBookingData');
}

// Add auto-save functionality
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('bookingForm');
    if (form) {
        // Load saved data
        loadSavedFormData();
        
        // Auto-save on input change
        form.addEventListener('input', function() {
            setTimeout(autoSaveFormData, 500);
        });
        
        // Clear saved data on successful submission
        form.addEventListener('submit', function() {
            setTimeout(clearSavedFormData, 1000);
        });
    }
});
