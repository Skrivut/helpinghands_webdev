<?php
// File: db_connect.php

/* Database credentials. Modify these constants as necessary */
// 1. Database Host
define('DB_SERVER', 'localhost');

// 2. Database Username (XAMPP default is typically 'root')
define('DB_USERNAME', 'root');

// 3. Database Password (XAMPP default is typically blank)
define('DB_PASSWORD', '');

// 4. Database Name (The name you created in phpMyAdmin)
define('DB_NAME', 'swap_share_db');

// 5. Database Port (Use the port you set in Step 1, e.g., 3307)
define('DB_PORT', 3307);


// Attempt to establish a connection using the mysqli object
$conn = new mysqli(DB_SERVER, DB_USERNAME, DB_PASSWORD, DB_NAME, DB_PORT);

// Check connection
if ($conn->connect_error) {
    // If connection fails, stop execution and show the error
    die("ERROR: Could not connect to the database. Check your XAMPP server and db_connect.php settings. " . $conn->connect_error);
}

// If connection is successful, $conn object is ready to use!
