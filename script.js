document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.getElementById('theme-toggle');
    const body = document.body;
    const darkModeClass = 'dark-mode';

    // Function to set the visual theme and update the button icon
    function applyTheme(isDarkMode) {
        if (isDarkMode) {
            body.classList.add(darkModeClass);
            if (toggleButton) {
                toggleButton.innerHTML = '<i class="uil uil-sun"></i>';
            }
        } else {
            body.classList.remove(darkModeClass);
            if (toggleButton) {
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

   // ... (Theme Toggle Code is great, keeping it) ...

// Function to handle form submission using Fetch API (AJAX)
function handleFormSubmit(event) {
    event.preventDefault(); // Stop the default page reload

    const form = event.target;
    const url = form.action;
    const formData = new FormData(form);

    // *** FIX: Find the specific message container based on form ID ***
    let messageContainer;
    if (form.id === 'login-form') {
        messageContainer = document.getElementById('login-message');
    } else if (form.id === 'register-form') {
        messageContainer = document.getElementById('register-message');
    } else {
        console.error("Unknown form ID submitted.");
        return;
    }
    
    // Clear previous message
    messageContainer.textContent = "Processing...";
    messageContainer.style.color = "gray";

    fetch(url, {
        method: 'POST',
        body: formData,
    })
    .then(response => {
        // Check if the response is JSON (important for debugging)
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
            return response.json();
        } else {
            throw new Error(`Server did not return JSON. Check PHP file (${url}).`);
        }
    })
    .then(data => {
        if (data.success) {
            messageContainer.style.color = '#388E3C'; // Success green
            messageContainer.textContent = data.message;
            
            // **SUCCESSFUL ACTION: CLEAR AND REDIRECT**
            // The form reset needs to be here if you want to clear inputs before redirecting
            
            if (data.redirect) {
                // Wait a moment for the user to see the success message
                setTimeout(() => {
                    window.location.href = data.redirect; // This redirects the browser
                }, 1500); 
            } else {
                 form.reset(); // Clear form if no redirect
            }
        } else {
            messageContainer.style.color = 'red';
            messageContainer.textContent = data.message;
        }
    })
    .catch(error => {
        console.error('Fetch Error:', error);
        messageContainer.textContent = `Connection error. (Details: ${error.message})`;
        messageContainer.style.color = 'red';
    });
}

// Attach listeners to the forms when the page loads
const registerForm = document.getElementById('register-form'); // Use 'register-form'
const loginForm = document.getElementById('login-form');

if (registerForm) {
    registerForm.addEventListener('submit', handleFormSubmit);
}

if (loginForm) {
    loginForm.addEventListener('submit', handleFormSubmit);
}
});