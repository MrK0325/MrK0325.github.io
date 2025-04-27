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