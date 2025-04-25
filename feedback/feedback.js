document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('feedbackForm');
    const formErrorMessage = document.getElementById('form-error-message');
    const formSection = document.getElementById('formSection');
    const formPreview = document.getElementById('formPreview');
    const previewContent = document.getElementById('previewContent');
    const editButton = document.getElementById('editButton');
    const finalSubmitButton = document.getElementById('finalSubmitButton');
    const thankYouMessage = document.getElementById('thankYouMessage');
    
    // Required fields
    const requiredFields = [
        { id: 'firstname', type: 'text', label: 'First Name' },
        { id: 'lastname', type: 'text', label: 'Last Name' },
        { id: 'email', type: 'email', label: 'Email Address' },
        { id: 'teleNo', type: 'tel', label: 'Phone Number' },
        { id: 'Informative_easy', type: 'radio', label: 'Was this website informative and easy to navigate?' }
    ];
    
    // All fields including optional ones
    const allFields = [
        ...requiredFields,
        { id: 'suggest', type: 'textarea', label: 'Suggested Improvements' },
        { id: 'update', type: 'select', label: 'Receive Updates' },
        { id: 'comment', type: 'textarea', label: 'Additional Questions or Requests' },
        { id: 'star', type: 'radio', label: 'Experience Rating' }
    ];
    
    // Validate individual field
    function validateField(field) {
        const element = document.getElementById(field.id);
        const errorElement = document.getElementById(`${field.id}-error`);
        let isValid = true;
        
        if (field.type === 'radio') {
            const radioButtons = document.getElementsByName(field.id);
            const isChecked = Array.from(radioButtons).some(radio => radio.checked);
            
            if (!isChecked) {
                errorElement.style.display = 'block';
                isValid = false;
            } else {
                errorElement.style.display = 'none';
            }
        } else if (field.type === 'email') {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            
            if (!element.value.trim() || !emailPattern.test(element.value)) {
                element.classList.add('error-field');
                errorElement.style.display = 'block';
                isValid = false;
            } else {
                element.classList.remove('error-field');
                errorElement.style.display = 'none';
            }
        } else {
            if (!element.value.trim()) {
                element.classList.add('error-field');
                errorElement.style.display = 'block';
                isValid = false;
            } else {
                element.classList.remove('error-field');
                errorElement.style.display = 'none';
            }
        }
        
        return isValid;
    }
    
    // Function to get field value
    function getFieldValue(field) {
        const element = document.getElementById(field.id);
        
        if (field.type === 'radio') {
            const radioButtons = document.getElementsByName(field.id);
            const selectedRadio = Array.from(radioButtons).find(radio => radio.checked);
            return selectedRadio ? selectedRadio.value : 'Not selected';
        } else if (field.type === 'select') {
            return element.options[element.selectedIndex].text;
        } else {
            return element.value.trim() || 'Not provided';
        }
    }
    
    // Function to generate preview content
    function generatePreview() {
        let previewHTML = '';
        
        allFields.forEach(field => {
            // Skip empty optional fields
            if ((field.id === 'suggest' || field.id === 'comment') && 
                document.getElementById(field.id).value.trim() === '') {
                return;
            }
            
            let value = getFieldValue(field);
            
            // Format rating value
            if (field.id === 'star' && value !== 'Not selected') {
                value = `${value} out of 5 stars`;
            }
            
            previewHTML += `
                <div class="preview-row">
                    <div class="preview-label">${field.label}:</div>
                    <div class="preview-value">${value}</div>
                </div>
            `;
        });
        
        previewContent.innerHTML = previewHTML;
    }
    
    // Add input event listeners for real-time validation
    requiredFields.forEach(field => {
        if (field.type === 'radio') {
            const radioButtons = document.getElementsByName(field.id);
            radioButtons.forEach(radio => {
                radio.addEventListener('change', function() {
                    validateField(field);
                });
            });
        } else {
            const element = document.getElementById(field.id);
            element.addEventListener('input', function() {
                validateField(field);
            });
            element.addEventListener('blur', function() {
                validateField(field);
            });
        }
    });
    
    // Show preview function
    function showPreview() {
        generatePreview();
        formSection.style.display = 'none';
        formPreview.style.display = 'block';
        thankYouMessage.style.display = 'none';
        window.scrollTo(0, 0);
    }
    
    // Return to edit form
    editButton.addEventListener('click', function() {
        formSection.style.display = 'block';
        formPreview.style.display = 'none';
        thankYouMessage.style.display = 'none';
        window.scrollTo(0, 0);
    });
    
    // Final submission
    finalSubmitButton.addEventListener('click', function() {
        formSection.style.display = 'none';
        formPreview.style.display = 'none';
        thankYouMessage.style.display = 'block';
        window.scrollTo(0, 0);
        
        // Here you would normally send the form data to a server
        console.log('Form submitted successfully!');
    });
    
    // Form submission handler
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        let isFormValid = true;
        
        // Validate all required fields
        requiredFields.forEach(field => {
            if (!validateField(field)) {
                isFormValid = false;
            }
        });
        
        // Show or hide form error message
        if (!isFormValid) {
            formErrorMessage.style.display = 'block';
            formErrorMessage.scrollIntoView({ behavior: 'smooth' });
        } else {
            formErrorMessage.style.display = 'none';
            showPreview();
        }
    });
});
document.getElementById('finalSubmitButton').addEventListener('click', function() {
    document.getElementById('thankYouMessage').style.display = 'block';
    document.querySelector('.footer').classList.add('thank-you-footer');
});