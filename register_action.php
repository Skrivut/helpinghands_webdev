<?php
session_start();
require_once "db_connect.php";

// Set response header to JSON for the JavaScript Fetch API
header('Content-Type: application/json');

$response = ["success" => false, "message" => "", "redirect" => null];

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // 1. Collect and sanitize input
    $username = trim($_POST["username"]);
    $email = trim($_POST["email"]);
    $password = trim($_POST["password"]);

    if (empty($username) || empty($email) || empty($password)) {
        $response["message"] = "Please fill all fields.";
        echo json_encode($response);
        exit;
    }

    // 2. Check if email or username already exists
    $sql_check = "SELECT id FROM users WHERE username = ? OR email = ?";
    if ($stmt_check = $conn->prepare($sql_check)) {
        $stmt_check->bind_param("ss", $username, $email);
        $stmt_check->execute();
        $stmt_check->store_result();

        if ($stmt_check->num_rows > 0) {
            $response["message"] = "This username or email is already in use.";
            echo json_encode($response);
            $stmt_check->close();
            $conn->close();
            exit;
        }
        $stmt_check->close();
    }

    // 3. Securely hash the password
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);

    // 4. Prepare and execute the INSERT statement
    $sql_insert = "INSERT INTO users (username, email, password, created_at) VALUES (?, ?, ?, NOW())";

    if ($stmt_insert = $conn->prepare($sql_insert)) {
        $stmt_insert->bind_param("sss", $username, $email, $hashed_password);

        if ($stmt_insert->execute()) {
            // **SUCCESSFUL REGISTRATION - SET REDIRECT**
            $response["success"] = true;
            $response["message"] = "Registration successful! Redirecting to dashboard...";
            $response["redirect"] = "dashboard.php"; // <--- ADDED REDIRECT URL
        } else {
            $response["message"] = "Database error: " . $conn->error;
        }
        $stmt_insert->close();
    } else {
        $response["message"] = "Server error preparing statement: " . $conn->error;
    }
} else {
    $response["message"] = "Invalid request method.";
}

$conn->close();
echo json_encode($response);
