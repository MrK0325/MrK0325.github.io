// Map modal functionality
const modal = document.getElementById('mapModal');
const closeBtn = document.getElementsByClassName('close-btn')[0];
let map;

function openMap() {
    modal.style.display = "block";
    
    if (!map) {
        // Coordinates for Av. San Martin & Dr. Alejandro Ramirez, Santa Cruz, Bolivia
        const storeLocation = [-17.761408, -63.196803]; // Santa Cruz coordinates
        
        map = L.map('map').setView(storeLocation, 16); // Increased zoom level to 16 for better street view
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        // Add marker with popup
        L.marker(storeLocation)
            .addTo(map)
            .bindPopup(`
                <strong>Cactus Paradise</strong><br>
                Av San Martin calle Dr Alejandro Ramirez<br>
                Santa Cruz, Bolivia<br>
                <a href="https://www.openstreetmap.org/?mlat=${storeLocation[0]}&mlon=${storeLocation[1]}" 
                   target="_blank">Get Directions</a>
            `).openPopup();
    }
    
    setTimeout(() => {
        map.invalidateSize();
    }, 100);
}

// Close modal when clicking X
closeBtn.onclick = function() {
    modal.style.display = "none";
}

// Close modal when clicking outside
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// Form submission handling
async function handleSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);

    try {
        // Send form data to FormSubmit
        await fetch('https://formsubmit.co/cactusparadise03@gmail.com', {
            method: 'POST',
            body: formData
        });

        // Show thank you message
        document.getElementById('thank-you').style.display = 'flex';
        
        // Clear form
        form.reset();
    } catch (error) {
        alert('There was an error sending your message. Please try again.');
    }
}

// Hide thank you message
function hideThankYou() {
    document.getElementById('thank-you').style.display = 'none';
}

// Payment Modal functionality
const paymentModal = document.getElementById('paymentModal');
const paymentCloseBtn = paymentModal.querySelector('.close-btn');
const paymentForm = document.getElementById('paymentForm');

// Cactus prices (you can adjust these)
const cactusPrices = {
    'Desert Beauty': 29.99,
    'Spiky Wonder': 34.99,
    'Succulent Dream': 39.99,
    'Golden Barrel': 44.99,
    'Dessert Star': 49.99,
    'Pink Crown': 54.99
};

// Function to open payment modal
function openPaymentModal(cactusName, description) {
    document.getElementById('cactusTitle').textContent = cactusName;
    document.getElementById('cactusDescription').textContent = description;
    document.getElementById('cactusPrice').textContent = cactusPrices[cactusName].toFixed(2);
    paymentModal.style.display = 'block';
}

// Close payment modal
paymentCloseBtn.onclick = function() {
    paymentModal.style.display = 'none';
}

// Close payment modal when clicking outside
window.onclick = function(event) {
    if (event.target == paymentModal) {
        paymentModal.style.display = 'none';
    }
}

// Success Modal functionality
const successModal = document.getElementById('successModal');
const successCloseBtn = successModal.querySelector('.close-btn');

function showSuccessModal() {
    successModal.style.display = 'block';
}

function closeSuccessModal() {
    successModal.style.display = 'none';
}

successCloseBtn.onclick = closeSuccessModal;

// Credit Card Validation Functions
function validateCardNumber(cardNumber) {
    // Remove spaces and non-numeric characters
    const cleaned = cardNumber.replace(/\D/g, '');
    
    // Check if it's a valid length (15-16 digits)
    return cleaned.length >= 15 && cleaned.length <= 16;
}

function validateExpiryDate(expiryDate) {
    // Format: MM/YY
    const regex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
    if (!regex.test(expiryDate)) {
        return false;
    }
    
    const [month, year] = expiryDate.split('/');
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;
    
    const expiryYear = parseInt(year);
    const expiryMonth = parseInt(month);
    
    if (expiryYear < currentYear) {
        return false;
    }
    
    if (expiryYear === currentYear && expiryMonth < currentMonth) {
        return false;
    }
    
    return true;
}

function validateCVV(cvv) {
    // CVV should be 3 or 4 digits
    return /^[0-9]{3,4}$/.test(cvv);
}

// Function to show error message
function showError(inputId, message) {
    const input = document.getElementById(inputId);
    const errorElement = document.getElementById(inputId + 'Error');
    input.classList.add('error');
    errorElement.textContent = message;
}

// Function to clear error message
function clearError(inputId) {
    const input = document.getElementById(inputId);
    const errorElement = document.getElementById(inputId + 'Error');
    input.classList.remove('error');
    errorElement.textContent = '';
}

// Update the payment form submission handler
paymentForm.addEventListener('submit', function(event) {
    event.preventDefault();
    
    // Clear all previous errors
    clearError('cardNumber');
    clearError('cardName');
    clearError('expiryDate');
    clearError('cvv');
    
    // Get form values
    const cardNumber = document.getElementById('cardNumber').value;
    const cardName = document.getElementById('cardName').value;
    const expiryDate = document.getElementById('expiryDate').value;
    const cvv = document.getElementById('cvv').value;
    
    // Validate all fields
    let isValid = true;
    
    if (!cardName.trim()) {
        showError('cardName', 'Please enter the cardholder name');
        isValid = false;
    }
    
    if (!validateCardNumber(cardNumber)) {
        showError('cardNumber', 'Please enter a valid 15-16 digit card number');
        isValid = false;
    }
    
    if (!validateExpiryDate(expiryDate)) {
        showError('expiryDate', 'Please enter a valid expiration date (MM/YY)');
        isValid = false;
    }
    
    if (!validateCVV(cvv)) {
        showError('cvv', 'Please enter a valid CVV (3 or 4 digits)');
        isValid = false;
    }
    
    if (!isValid) {
        return;
    }
    
    // Close payment modal and show success message
    paymentModal.style.display = 'none';
    paymentForm.reset();
    showSuccessModal();
});

// Add input event listeners to clear errors when user starts typing
document.querySelectorAll('.payment-form input').forEach(input => {
    input.addEventListener('input', function() {
        clearError(this.id);
    });
});

// Add input formatting for card number
document.getElementById('cardNumber').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    value = value.replace(/(\d{4})/g, '$1 ').trim();
    e.target.value = value;
});

// Add input formatting for expiry date
document.getElementById('expiryDate').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    
    // Allow backspace and delete
    if (e.inputType === 'deleteContentBackward' || e.inputType === 'deleteContentForward') {
        e.target.value = value;
        return;
    }
    
    // Format the date
    if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    
    e.target.value = value;
});

// Add keydown event to handle backspace properly
document.getElementById('expiryDate').addEventListener('keydown', function(e) {
    // Allow backspace, delete, tab, escape, enter
    if ([46, 8, 9, 27, 13].indexOf(e.keyCode) !== -1 ||
        // Allow: Ctrl+A, Command+A
        (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) ||
        // Allow: home, end, left, right, down, up
        (e.keyCode >= 35 && e.keyCode <= 40)) {
        return;
    }
    
    // Ensure that it is a number and stop the keypress
    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
        e.preventDefault();
    }
});

// Add input formatting for CVV
document.getElementById('cvv').addEventListener('input', function(e) {
    e.target.value = e.target.value.replace(/\D/g, '');
});

// Update the "Learn More" buttons to open payment modal
document.querySelectorAll('.product-card button').forEach(button => {
    button.addEventListener('click', function() {
        const card = this.closest('.product-card');
        const cactusName = card.querySelector('h3').textContent;
        const description = card.querySelector('p').textContent;
        openPaymentModal(cactusName, description);
    });
}); 