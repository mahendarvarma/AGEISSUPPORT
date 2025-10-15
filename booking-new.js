// New Booking System JavaScript - Simple and Reliable
// AGEIS SUPPORT

let currentStep = 1;
const totalSteps = 3;

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing new booking system...');
    initializeBookingSystem();
});

function initializeBookingSystem() {
    // Set minimum date to tomorrow
    const dateInput = document.getElementById('preferredDate');
    if (dateInput) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        dateInput.min = tomorrow.toISOString().split('T')[0];
    }
    
    // Show first step
    showStep(1);
    
    console.log('Booking system initialized successfully');
}

// Show specific step
function showStep(stepNumber) {
    console.log('Showing step:', stepNumber);
    
    // Hide all steps
    for (let i = 1; i <= totalSteps; i++) {
        const stepElement = document.getElementById(`step${i}`);
        if (stepElement) {
            stepElement.style.display = 'none';
        }
    }
    
    // Show current step
    const currentStepElement = document.getElementById(`step${stepNumber}`);
    if (currentStepElement) {
        currentStepElement.style.display = 'block';
    }
    
    // Update progress indicators
    updateProgressIndicators(stepNumber);
    
    // Update summary if on step 3
    if (stepNumber === 3) {
        updateSummary();
    }
    
    // Scroll to form
    const formContainer = document.querySelector('.booking-form-container');
    if (formContainer) {
        formContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Update progress indicators
function updateProgressIndicators(stepNumber) {
    const indicators = document.querySelectorAll('.step-indicator');
    indicators.forEach((indicator, index) => {
        if (index + 1 <= stepNumber) {
            indicator.classList.add('active');
        } else {
            indicator.classList.remove('active');
        }
    });
}

// Go to next step
function nextStep() {
    console.log('Next step clicked, current step:', currentStep);
    
    if (validateCurrentStep()) {
        if (currentStep < totalSteps) {
            currentStep++;
            showStep(currentStep);
        }
    } else {
        console.log('Validation failed, staying on current step');
    }
}

// Go to previous step
function prevStep() {
    console.log('Previous step clicked, current step:', currentStep);
    
    if (currentStep > 1) {
        currentStep--;
        showStep(currentStep);
    }
}

// Validate current step
function validateCurrentStep() {
    const currentStepElement = document.getElementById(`step${currentStep}`);
    if (!currentStepElement) {
        console.error('Current step element not found');
        return false;
    }
    
    const requiredFields = currentStepElement.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    console.log('Step validation result:', isValid);
    return isValid;
}

// Validate individual field
function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name || field.id;
    
    // Clear previous error
    clearFieldError(field);
    
    // Check if required field is empty
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, `${getFieldLabel(field)} is required`);
        return false;
    }
    
    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showFieldError(field, 'Please enter a valid email address');
            return false;
        }
    }
    
    // Phone validation
    if (field.type === 'tel' && value) {
        const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
        if (!phoneRegex.test(value)) {
            showFieldError(field, 'Please enter a valid phone number');
            return false;
        }
    }
    
    return true;
}

// Show field error
function showFieldError(field, message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.color = '#e74c3c';
    errorDiv.style.fontSize = '0.9rem';
    errorDiv.style.marginTop = '0.25rem';
    
    field.parentNode.appendChild(errorDiv);
    field.style.borderColor = '#e74c3c';
}

// Clear field error
function clearFieldError(field) {
    const errorDiv = field.parentNode.querySelector('.field-error');
    if (errorDiv) {
        errorDiv.remove();
    }
    field.style.borderColor = '';
}

// Get field label
function getFieldLabel(field) {
    const label = field.parentNode.querySelector('label');
    return label ? label.textContent.replace('*', '').trim() : field.name || field.id;
}

// Update summary
function updateSummary() {
    const form = document.getElementById('bookingForm');
    if (!form) return;
    
    const formData = new FormData(form);
    const summaryContent = document.getElementById('summaryContent');
    
    if (summaryContent) {
        summaryContent.innerHTML = `
            <div class="summary-item">
                <strong>Service Type:</strong> ${formData.get('serviceType') || 'Not selected'}
            </div>
            <div class="summary-item">
                <strong>Frequency:</strong> ${formData.get('serviceFrequency') || 'Not selected'}
            </div>
            <div class="summary-item">
                <strong>Preferred Date:</strong> ${formData.get('preferredDate') || 'Not specified'}
            </div>
            <div class="summary-item">
                <strong>Preferred Time:</strong> ${formData.get('preferredTime') || 'Not specified'}
            </div>
            <div class="summary-item">
                <strong>Urgency:</strong> ${formData.get('urgency') || 'Standard'}
            </div>
            <div class="summary-item">
                <strong>Name:</strong> ${formData.get('firstName') || ''} ${formData.get('lastName') || ''}
            </div>
            <div class="summary-item">
                <strong>Email:</strong> ${formData.get('email') || ''}
            </div>
            <div class="summary-item">
                <strong>Phone:</strong> ${formData.get('phone') || ''}
            </div>
            <div class="summary-item">
                <strong>Address:</strong> ${formData.get('address') || ''}
            </div>
            <div class="summary-item">
                <strong>Age Range:</strong> ${formData.get('age') || 'Not specified'}
            </div>
            <div class="summary-item">
                <strong>Booking For:</strong> ${formData.get('relationship') || 'Myself'}
            </div>
            <div class="summary-item">
                <strong>Funding Source:</strong> ${formData.get('funding') || 'Not specified'}
            </div>
            ${formData.get('additionalNotes') ? `
            <div class="summary-item">
                <strong>Additional Notes:</strong> ${formData.get('additionalNotes')}
            </div>
            ` : ''}
        `;
    }
}

// Submit booking
function submitBooking() {
    console.log('Submitting booking...');
    
    // Validate final step
    if (!validateCurrentStep()) {
        console.log('Final validation failed');
        return;
    }
    
    // Check terms acceptance
    const termsAccepted = document.getElementById('termsAccepted');
    if (!termsAccepted.checked) {
        alert('Please accept the Terms of Service and Privacy Policy to continue.');
        return;
    }
    
    // Get form data
    const form = document.getElementById('bookingForm');
    const formData = new FormData(form);
    
    // Convert to object
    const bookingData = {};
    for (let [key, value] of formData.entries()) {
        bookingData[key] = value;
    }
    
    // Save to localStorage (for demo purposes)
    localStorage.setItem('ageisBookingData', JSON.stringify(bookingData));
    
    // Show success message
    alert('Thank you! Your booking request has been submitted successfully. We will contact you within 24 hours to confirm your service.');
    
    // Reset form
    form.reset();
    currentStep = 1;
    showStep(1);
    
    // Clear saved data
    localStorage.removeItem('ageisBookingData');
    
    console.log('Booking submitted successfully');
}

// Auto-save form data
document.addEventListener('input', function(e) {
    if (e.target.closest('#bookingForm')) {
        saveFormData();
    }
});

// Save form data to localStorage
function saveFormData() {
    const form = document.getElementById('bookingForm');
    if (!form) return;
    
    const formData = new FormData(form);
    const data = {};
    
    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }
    
    localStorage.setItem('ageisBookingData', JSON.stringify(data));
}

// Load saved form data
function loadSavedFormData() {
    const form = document.getElementById('bookingForm');
    const savedData = localStorage.getItem('ageisBookingData');
    
    if (savedData && form) {
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

// Load saved data on page load
window.addEventListener('load', function() {
    setTimeout(() => {
        loadSavedFormData();
    }, 100);
});

// Real-time validation
document.addEventListener('blur', function(e) {
    if (e.target.closest('#bookingForm')) {
        validateField(e.target);
    }
}, true);

// Clear errors on input
document.addEventListener('input', function(e) {
    if (e.target.closest('#bookingForm')) {
        clearFieldError(e.target);
    }
});

console.log('New booking system loaded successfully');
