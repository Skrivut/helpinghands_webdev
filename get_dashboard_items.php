<?php
// get_dashboard_items.php - Get all items from OTHER users for dashboard
session_start();
require_once 'db_connect.php';

header('Content-Type: application/json');

// Check if user is logged in
if (!isset($_SESSION['id']) || !isset($_SESSION['loggedin']) || $_SESSION['loggedin'] !== true) {
    echo json_encode(['success' => false, 'message' => 'Not logged in']);
    exit;
}

$current_user_id = $_SESSION['id'];

try {
    // Build query with filters
    $sql = "SELECT i.*, u.username as owner_name 
            FROM trade_items i 
            JOIN users u ON i.user_id = u.id 
            WHERE i.user_id != ? AND i.status = 'available'";

    $params = [$current_user_id];
    $types = "i";

    // Add category filter if provided
    if (isset($_GET['category']) && !empty($_GET['category'])) {
        $sql .= " AND i.category = ?";
        $params[] = $_GET['category'];
        $types .= "s";
    }

    // Add condition filter if provided
    if (isset($_GET['condition']) && !empty($_GET['condition'])) {
        $sql .= " AND i.item_condition = ?";
        $params[] = $_GET['condition'];
        $types .= "s";
    }

    $sql .= " ORDER BY i.created_at DESC";

    $stmt = $conn->prepare($sql);
    
    if (!$stmt) {
        throw new Exception("Prepare failed: " . $conn->error);
    }
    
    $stmt->bind_param($types, ...$params);
    $stmt->execute();
    $result = $stmt->get_result();

    $items = [];
    while ($row = $result->fetch_assoc()) {
        $items[] = $row;
    }

    echo json_encode([
        'success' => true,
        'items' => $items,
        'count' => count($items)
    ]);

    $stmt->close();
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false, 
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}

$conn->close();
?>