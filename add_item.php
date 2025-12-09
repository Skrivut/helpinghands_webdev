<?php
// add_item.php - Handle adding new trade items
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

// Get POST data
$item_name = trim($_POST['item_name'] ?? '');
$description = trim($_POST['description'] ?? '');
$category = trim($_POST['category'] ?? '');
$condition = trim($_POST['condition'] ?? '');
// Price is optional for barter system
$price = 0; // Set to 0 for barter/swap only

// Validation
$errors = [];

if (empty($item_name)) {
    $errors[] = 'Item name is required';
}

if (empty($category)) {
    $errors[] = 'Category is required';
}

if (empty($condition)) {
    $errors[] = 'Condition is required';
}

// Price validation removed for barter system

if (!empty($errors)) {
    echo json_encode(['success' => false, 'message' => implode(', ', $errors)]);
    exit;
}

// Log for debugging
error_log("Adding item - User: $user_id, Name: $item_name, Category: $category, Condition: $condition");

// Handle image upload (optional)
$image_path = null;
if (isset($_FILES['item_image']) && $_FILES['item_image']['error'] === UPLOAD_ERR_OK) {
    $allowed_types = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
    $file_type = $_FILES['item_image']['type'];
    
    if (in_array($file_type, $allowed_types)) {
        $upload_dir = 'uploads/items/';
        
        // Create directory if it doesn't exist
        if (!is_dir($upload_dir)) {
            mkdir($upload_dir, 0777, true);
        }
        
        $file_extension = pathinfo($_FILES['item_image']['name'], PATHINFO_EXTENSION);
        $new_filename = uniqid('item_') . '.' . $file_extension;
        $upload_path = $upload_dir . $new_filename;
        
        if (move_uploaded_file($_FILES['item_image']['tmp_name'], $upload_path)) {
            $image_path = $upload_path;
        }
    }
}

// Insert item into database
$stmt = $conn->prepare("INSERT INTO trade_items (user_id, item_name, description, category, item_condition, price, image_path, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, 'available', NOW())");

if (!$stmt) {
    echo json_encode(['success' => false, 'message' => 'Prepare failed: ' . $conn->error]);
    exit;
}

$stmt->bind_param("issssds", $user_id, $item_name, $description, $category, $condition, $price, $image_path);

if ($stmt->execute()) {
    $item_id = $stmt->insert_id;
    
    echo json_encode([
        'success' => true,
        'message' => 'Item added successfully!',
        'item_id' => $item_id
    ]);
} else {
    // Log the actual error for debugging
    error_log("MySQL Error: " . $stmt->error);
    echo json_encode([
        'success' => false, 
        'message' => 'Failed to add item: ' . $stmt->error
    ]);
}

$stmt->close();
$conn->close();
?>