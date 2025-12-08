<?php
header('Content-Type: application/json');
session_start();

// Use the shared database connection
require_once "db_connect.php";

$response = ["success" => false, "message" => "An unknown error occurred."];

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    $response["message"] = "Invalid request method.";
    echo json_encode($response);
    exit;
}

// Check database connection
if (!isset($conn) || $conn->connect_error) {
    $response["message"] = "Database connection error.";
    echo json_encode($response);
    exit;
}

// Get and sanitize input
$username = trim($_POST['username'] ?? '');
$email = trim($_POST['email'] ?? '');
$password = trim($_POST['password'] ?? '');

// Validate inputs
if (empty($username) || empty($email) || empty($password)) {
    $response["message"] = "All fields are required.";
    echo json_encode($response);
    exit;
}

if (strlen($username) < 3 || strlen($username) > 50) {
    $response["message"] = "Username must be between 3 and 50 characters.";
    echo json_encode($response);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $response["message"] = "Invalid email format.";
    echo json_encode($response);
    exit;
}

if (strlen($password) < 8) {
    $response["message"] = "Password must be at least 8 characters long.";
    echo json_encode($response);
    exit;
}

// Check if username exists
$stmt = $conn->prepare("SELECT id FROM users WHERE username = ? LIMIT 1");
$stmt->bind_param("s", $username);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows > 0) {
    $stmt->close();
    $conn->close();
    $response["message"] = "Username is already taken.";
    echo json_encode($response);
    exit;
}
$stmt->close();

// Check if email exists
$stmt = $conn->prepare("SELECT id FROM users WHERE email = ? LIMIT 1");
$stmt->bind_param("s", $email);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows > 0) {
    $stmt->close();
    $conn->close();
    $response["message"] = "Email is already registered.";
    echo json_encode($response);
    exit;
}
$stmt->close();

// Hash password
$hashed_password = password_hash($password, PASSWORD_DEFAULT);

// Insert new user (column name is 'password' not 'password_hash')
$stmt = $conn->prepare("INSERT INTO users (username, email, password) VALUES (?, ?, ?)");
$stmt->bind_param("sss", $username, $email, $hashed_password);

if ($stmt->execute()) {
    $response["success"] = true;
    $response["message"] = "Registration successful! You can now log in.";
} else {
    $response["message"] = "Registration failed: " . $stmt->error;
    error_log("Registration failed: " . $stmt->error);
}

$stmt->close();
$conn->close();

echo json_encode($response);
exit;
