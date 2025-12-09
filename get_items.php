<?php
// get_items.php - Retrieve user's trade items
session_start();
require_once 'config.php';

header('Content-Type: application/json');

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Please login first']);
    exit;
}

$user_id = $_SESSION['user_id'];

// Get all items for the logged-in user
$stmt = $conn->prepare("SELECT id, item_name, description, category, item_condition, price, image_path, status, created_at FROM trade_items WHERE user_id = ? ORDER BY created_at DESC");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

$items = [];
while ($row = $result->fetch_assoc()) {
    $items[] = [
        'id' => $row['id'],
        'item_name' => $row['item_name'],
        'description' => $row['description'],
        'category' => $row['category'],
        'condition' => $row['item_condition'],
        'price' => $row['price'],
        'image_path' => $row['image_path'],
        'status' => $row['status'],
        'created_at' => $row['created_at']
    ];
}

echo json_encode([
    'success' => true,
    'items' => $items,
    'count' => count($items)
]);

$stmt->close();
$conn->close();
