<?php
// File: login.php

session_start();
require_once "db_connect.php";

header('Content-Type: application/json');

$response = ["success" => false, "message" => "An unknown error occurred.", "redirect" => null, "username" => null];

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (!isset($conn) || $conn->connect_error) {
        $response["message"] = "Database connection error.";
        echo json_encode($response);
        exit;
    }

    $username = trim($_POST["username"] ?? '');
    $password = trim($_POST["password"] ?? '');

    if (empty($username) || empty($password)) {
        $response["message"] = "Please enter both username and password.";
        echo json_encode($response);
        exit;
    }

    $sql = "SELECT id, username, password FROM users WHERE username = ?";

    if ($stmt = $conn->prepare($sql)) {
        $stmt->bind_param("s", $username);
        $stmt->execute();
        $stmt->store_result();

        if ($stmt->num_rows == 1) {
            $stmt->bind_result($id, $db_username, $hashed_password);

            if ($stmt->fetch() && $hashed_password !== null) {
                if (password_verify($password, $hashed_password)) {
                    $_SESSION["loggedin"] = true;
                    $_SESSION["id"] = $id;
                    $_SESSION["username"] = $db_username;

                    $response["success"] = true;
                    $response["message"] = "Login successful! Redirecting...";
                    $response["redirect"] = "dashboard.html";
                    $response["username"] = $db_username; // ADD THIS LINE
                } else {
                    $response["message"] = "Invalid username or password.";
                }
            } else {
                $response["message"] = "User found but data is corrupted.";
            }
        } else {
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
