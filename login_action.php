<?php
session_start();
require_once "db_connect.php";

// Set response header to JSON for the JavaScript Fetch API
header('Content-Type: application/json');

$response = ["success" => false, "message" => "", "redirect" => ""];

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // 1. Collect and sanitize input
    $email = trim($_POST["logemail"]);
    $password = trim($_POST["logpass"]);

    if (empty($email) || empty($password)) {
        $response["message"] = "Please enter both email and password.";
        echo json_encode($response);
        exit;
    }

    // 2. Prepare a SELECT statement
    $sql = "SELECT id, username, password FROM users WHERE email = ?";

    if ($stmt = $conn->prepare($sql)) {
        $stmt->bind_param("s", $email);

        if ($stmt->execute()) {
            $stmt->store_result();

            if ($stmt->num_rows == 1) {
                $stmt->bind_result($user_id, $username, $hashed_password);
                $stmt->fetch();

                // 3. Verify the password against the hash
                if (password_verify($password, $hashed_password)) {
                    // Password is correct, start session
                    $_SESSION["loggedin"] = true;
                    $_SESSION["id"] = $user_id;
                    $_SESSION["username"] = $username;

                    $response["success"] = true;
                    $response["message"] = "Login successful!";
                    $response["redirect"] = "index.php"; // Redirect to index.php (needs to be renamed)
                } else {
                    $response["message"] = "Invalid email or password.";
                }
            } else {
                $response["message"] = "Invalid email or password.";
            }
        } else {
            $response["message"] = "Oops! Something went wrong on the server.";
        }
        $stmt->close();
    } else {
        $response["message"] = "Server error preparing statement: " . $conn->error;
    }
} else {
    $response["message"] = "Invalid request method.";
}

$conn->close();
echo json_encode($response);
