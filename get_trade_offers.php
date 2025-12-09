<?php
// get_trade_offers.php - Get trade offers for current user's items
session_start();
require_once 'db_connect.php';

header('Content-Type: application/json');

// Check if user is logged in
if (!isset($_SESSION['id']) || !isset($_SESSION['loggedin']) || $_SESSION['loggedin'] !== true) {
    echo json_encode(['success' => false, 'message' => 'Not logged in']);
    exit;
}

$current_user_id = $_SESSION['id'];

// Get offers for items owned by the current user
$sql = "SELECT 
            o.*,
            i.item_name,
            u.username as offerer_name
        FROM trade_offers o
        JOIN trade_items i ON o.item_id = i.id
        JOIN users u ON o.offerer_id = u.id
        WHERE i.user_id = ?
        ORDER BY o.created_at DESC
        LIMIT 10";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $current_user_id);
$stmt->execute();
$result = $stmt->get_result();

$offers = [];
while ($row = $result->fetch_assoc()) {
    $offers[] = $row;
}

echo json_encode([
    'success' => true,
    'offers' => $offers
]);

$stmt->close();
$conn->close();
?>