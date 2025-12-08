<?php
// CRITICAL: Start the session to check if the user is logged in
session_start();

?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <title>Helping Hands</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.5.0/css/bootstrap.min.css" />
    <link
        rel="stylesheet"
        href="https://unicons.iconscout.com/release/v2.1.9/css/unicons.css" />
    <link rel="stylesheet" href="./style.css" />
    <link rel="stylesheet" href="./login_signup.css" />
</head>

<body>
    <nav class="main-nav">
        <h4 class="site-title">Helping Hands</h4>
        <div class="icon-buttons-group">
            <button
                id="theme-toggle"
                class="btn icon-btn"
                aria-label="Toggle Dark Mode">
                <i class="uil uil-moon"></i>
            </button>

            <a
                href="./login_signup.php"
                class="btn icon-btn"
                aria-label="Login / Sign Up">
                <i class="uil uil-user"></i>
            </a>
        </div>
    </nav>

    <div class="main-content-area">
        <section class="hero-section full-section" id="home">
            <div class="hero-text-content">
                <h1 class="display-4 mb-4">Give Your Old Items a New Life.</h1>
                <p class="lead">
                    Stop waste. Start swapping. Our community platform is dedicated to
                    preventing landfill waste through honest, cash-free exchanges and
                    charitable donations.
                </p>
                <a href="./login_signup.php" class="btn btn-lg cta-main-btn">
                    Start Swapping Today
                </a>
            </div>
        </section>

        <section class="info-section light-bg" id="trade">
            <div class="info-container">
                <h2 class="section-title">
                    <i class="uil uil-exchange-alt"></i> Trade & Barter
                </h2>
                <p>
                    Post items you no longer need and trade them for something you want
                    from another member. This ensures every item gets a replacement
                    home. Our platform is strictly no cash to prevent scams and focus
                    purely on sustainable exchange.
                </p>
            </div>
        </section>

        <section class="info-section dark-bg-section" id="donate">
            <div class="info-container">
                <h2 class="section-title">
                    <i class="uil uil-heartbeat"></i> Donate & Help
                </h2>
                <p>
                    Clear your space and support those in need. Easily donate useful
                    items to individuals or organizations assisting communities affected
                    by natural disasters (earthquakes, floods, etc.). Your item becomes
                    a vital resource.
                </p>
            </div>
        </section>

        <footer class="site-footer">
            <div class="info-container">
                <p>&copy; 2025 Swap & Share. Built for sustainability.</p>
            </div>
        </footer>
    </div>
    <script src="./script.js"></script>
</body>

</html>