<?php
session_start();
require_once "db_connect.php";

header('Content-Type: application/json');
$response = ["success" => false, "message" => "", "redirect" => null];

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = trim($_POST["username"]);
    $password = trim($_POST["password"]);

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
                // Verify password hash
                if (password_verify($password, $hashed_password)) {
                    $hashed = password_hash($password, PASSWORD_DEFAULT);
                    $_SESSION["loggedin"] = true;
                    $_SESSION["id"] = $id;
                    $_SESSION["username"] = $username;

                    $response["success"] = true;
                    $response["message"] = "Login successful! Redirecting...";
                    $response["redirect"] = "dashboard.php"; // Redirect to dashboard
                } else {
                    $response["message"] = "Invalid username or password.";
                }
            }
        } else {
            $response["message"] = "Invalid username or password.";
        }
        $stmt->close();
    }
} else {
    $response["message"] = "Invalid request method.";
}

$conn->close();
echo json_encode($response);
