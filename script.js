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