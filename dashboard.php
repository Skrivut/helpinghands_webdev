<?php
// Start the session to access user data
session_start();

// Security check: redirect if not logged in
if (!isset($_SESSION["loggedin"]) || $_SESSION["loggedin"] !== true) {
    header("location: login_signup.html");
    exit;
}

// Define the logged-in username for display
$username = htmlspecialchars($_SESSION["username"]);
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <title>Dashboard - Helping Hands</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.5.0/css/bootstrap.min.css" />
    <link rel="stylesheet" href="https://unicons.iconscout.com/release/v2.1.9/css/unicons.css" />
    <link rel="stylesheet" href="./style.css" />
    <link rel="stylesheet" href="./dashboard.css" />
</head>

<body>
    <nav class="main-nav">
        <h4 class="site-title">Helping Hands</h4>
        <div class="nav-links">
            <a href="./index.php" class="nav-link">Home</a>
            <a href="./dashboard.php" class="nav-link active">Dashboard</a>
            <a href="./trade.html" class="nav-link">Trade</a>
        </div>
        <div class="icon-buttons-group">
            <button id="theme-toggle" class="btn icon-btn" aria-label="Toggle Dark Mode">
                <i class="uil uil-moon"></i>
            </button>
            <a href="./logout.php" class="btn icon-btn" aria-label="Log Out">
                <i class="uil uil-sign-out-alt"></i>
            </a>
        </div>
    </nav>

    <div class="main-content-area">
        <section class="dashboard-section full-section">
            <h3 class="dashboard-title" style="margin-bottom: 5px;">Welcome, <?php echo $username; ?>!</h3>
            <h1 class="dashboard-title">Available Items</h1>
            <p class="dashboard-subtitle">Browse and discover items available for trade</p>

            <div class="dashboard-grid">
                <!-- Items will be dynamically loaded here by dashboard.js -->
                <div class="col-12 text-center py-5">
                    <div class="spinner-border text-primary" role="status">
                        <span class="sr-only">Loading...</span>
                    </div>
                    <p class="mt-3">Loading items...</p>
                </div>
            </div>
        </section>

        <section class="trade-offers-section full-section">
            <h2 class="dashboard-title">Recent Trade Offers</h2>
            <p class="dashboard-subtitle">Latest proposals showing item, description and the proposing user</p>

            <div id="tradeOffersContainer" class="trade-offers-grid">
                <!-- Trade offers will be dynamically loaded here by dashboard.js -->
                <div class="col-12 text-center py-5">
                    <div class="spinner-border text-primary" role="status">
                        <span class="sr-only">Loading...</span>
                    </div>
                    <p class="mt-3">Loading trade offers...</p>
                </div>
            </div>
        </section>
    </div>

    <script src="./script.js"></script>
    <script src="./api-client.js"></script>
    <script src="./dashboard.js"></script>
</body>

</html>