document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.getElementById('theme-toggle');
    const body = document.body;
    const darkModeClass = 'dark-mode';

    // Function to set the visual theme and update the button icon
    function applyTheme(isDarkMode) {
        if (isDarkMode) {
            body.classList.add(darkModeClass);
            if (toggleButton) {
                // Now only uses the SUN icon for Light Mode (when Dark Mode is ON)
                toggleButton.innerHTML = '<i class="uil uil-sun"></i>';
            }
        } else {
            body.classList.remove(darkModeClass);
            if (toggleButton) {
                // Now only uses the MOON icon for Dark Mode (when Light Mode is ON)
                toggleButton.innerHTML = '<i class="uil uil-moon"></i>';
            }
        }
    }

    // 1. CHECK LOCAL STORAGE AND APPLY THEME IMMEDIATELY
    const savedTheme = localStorage.getItem('theme');
    
    // Check if a theme is saved, otherwise default to light
    if (savedTheme === 'dark') {
        applyTheme(true);
    } else {
        applyTheme(false);
    }

    // 2. ADD EVENT LISTENER TO TOGGLE BUTTON (if it exists on the page)
    if (toggleButton) {
        toggleButton.addEventListener('click', () => {
            const isCurrentlyDark = body.classList.contains(darkModeClass);
            
            if (isCurrentlyDark) {
                // Switch to Light Mode and save preference
                applyTheme(false);
                localStorage.setItem('theme', 'light');
            } else {
                // Switch to Dark Mode and save preference
                applyTheme(true);
                localStorage.setItem('theme', 'dark');
            }
        });
    }
});

// ... (Your existing Dark Mode logic is here) ...

// Function to handle form submission using Fetch API (AJAX)
function handleFormSubmit(event) {
    event.preventDefault(); // Stop the default page reload

    const form = event.target;
    const url = form.action;
    const formData = new FormData(form);
    const messageContainer = form.querySelector('.form-message'); // Target the specific message area

    // Clear previous message
    messageContainer.textContent = "Processing...";
    messageContainer.style.color = "gray";

    fetch(url, {
        method: 'POST',
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            messageContainer.style.color = 'green';
            messageContainer.textContent = data.message;
            form.reset(); 

            // Handle successful login redirect
            if (data.redirect) {
                // Wait a moment for the user to see the success message
                setTimeout(() => {
                    window.location.href = data.redirect;
                }, 1500); 
            }
        } else {
            messageContainer.style.color = 'red';
            messageContainer.textContent = data.message;
        }
    })
    .catch(error => {
        console.error('Fetch Error:', error);
        messageContainer.textContent = "Connection error. Check your server.";
        messageContainer.style.color = 'red';
    });
}

// Attach listeners to the forms when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // ... (Your Dark Mode event listener is here) ...

    const signupForm = document.getElementById('signup-form');
    const loginForm = document.getElementById('login-form');

    if (signupForm) {
        signupForm.addEventListener('submit', handleFormSubmit);
    }

    if (loginForm) {
        loginForm.addEventListener('submit', handleFormSubmit);
    }
});