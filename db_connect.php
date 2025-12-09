<?php
$db_host = 'localhost';
$db_user = 'root';
$db_pass = '';
$db_name = 'swap_share_db';
$db_port = 3306;

$conn = new mysqli($db_host, $db_user, $db_pass, $db_name, $db_port);

if ($conn->connect_error) {
    header('Content-Type: application/json'); // ensure JSON
    echo json_encode([
        'success' => false,
        'message' => 'Database connection failed: ' . $conn->connect_error
    ]);
    exit;
}
?>