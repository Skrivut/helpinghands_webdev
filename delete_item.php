<?php
// delete_item.php - Delete a trade item
session_start();
require_once 'db_connect.php';

header('Content-Type: application/json');

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Please login first']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit;
}

$user_id = $_SESSION['user_id'];
$item_id = intval($_POST['item_id'] ?? 0);

if ($item_id <= 0) {
    echo json_encode(['success' => false, 'message' => 'Invalid item ID']);
    exit;
}

// Check if item belongs to user and get image path
$stmt = $conn->prepare("SELECT image_path FROM trade_items WHERE id = ? AND user_id = ?");
$stmt->bind_param("ii", $item_id, $user_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(['success' => false, 'message' => 'Item not found or unauthorized']);
    $stmt->close();
    exit;
}

$item = $result->fetch_assoc();
$stmt->close();

// Delete the item from database
$delete_stmt = $conn->prepare("DELETE FROM trade_items WHERE id = ? AND user_id = ?");
$delete_stmt->bind_param("ii", $item_id, $user_id);

if ($delete_stmt->execute()) {
    // Delete image file if exists
    if ($item['image_path'] && file_exists($item['image_path'])) {
        unlink($item['image_path']);
    }
    
    echo json_encode(['success' => true, 'message' => 'Item deleted successfully']);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to delete item']);
}

$delete_stmt->close();
$conn->close();
?>