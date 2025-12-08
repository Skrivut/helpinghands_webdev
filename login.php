<?php
// File: login_action.php

session_start();
require_once "db_connect.php"; // Connect to the database

// Set the response header to JSON format
header('Content-Type: application/json');

// Initialize the response array
$response = ["success" => false, "message" => "An unknown error occurred.", "redirect" => null];

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Add check for database connection
    if (!isset($conn) || $conn->connect_error) {
        $response["message"] = "Database connection error.";
        echo json_encode($response);
        exit;
    }

    // 1. Get and sanitize input
    $username = trim($_POST["username"] ?? '');
    $password = trim($_POST["password"] ?? '');

    if (empty($username) || empty($password)) {
        $response["message"] = "Please enter both username and password.";
        echo json_encode($response);
        exit;
    }

    // 2. Prepare SQL statement to fetch user data
    $sql = "SELECT id, username, password FROM users WHERE username = ?";

    if ($stmt = $conn->prepare($sql)) {
        $stmt->bind_param("s", $username);
        $stmt->execute();
        $stmt->store_result();

        if ($stmt->num_rows == 1) {
            $stmt->bind_result($id, $db_username, $hashed_password);

            if ($stmt->fetch() && $hashed_password !== null) {
                // 4. Verify password hash
                if (password_verify($password, $hashed_password)) {
                    // Password is correct, start a new session
                    $_SESSION["loggedin"] = true;
                    $_SESSION["id"] = $id;
                    $_SESSION["username"] = $db_username;

                    $response["success"] = true;
                    $response["message"] = "Login successful! Redirecting...";
                    $response["redirect"] = "dashboard.html"; // Changed to dashboard.html
                } else {
                    $response["message"] = "Invalid username or password.";
                }
            } else {
                $response["message"] = "User found but data is corrupted.";
            }
        } else {
            // User not found
            $response["message"] = "Invalid username or password.";
        }
        $stmt->close();
    } else {
        $response["message"] = "Database error: Could not prepare statement.";
        error_log("Prepare failed: " . $conn->error);
    }
} else {
    $response["message"] = "Invalid request method.";
}

if (isset($conn)) {
    $conn->close();
}
echo json_encode($response);
exit;
