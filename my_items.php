<?php
// my_items.php - Display user's trade items
session_start();

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    header('Location: login_signup.html');
    exit;
}

$user_name = $_SESSION['user_name'] ?? 'User';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Items for Trade</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.5.0/css/bootstrap.min.css"/>
    <link rel="stylesheet" href="https://unicons.iconscout.com/release/v2.1.9/css/unicons.css"/>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: #1a1d2e;
            color: #fff;
        }
        
        .navbar {
            background: #2d3250;
            padding: 20px 40px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        }
        
        .nav-links {
            display: flex;
            gap: 30px;
            align-items: center;
        }
        
        .nav-link {
            color: #a8a8b3;
            text-decoration: none;
            padding: 10px 20px;
            border-radius: 6px;
            transition: all 0.3s;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .nav-link.active {
            background: #5865f2;
            color: #fff;
        }
        
        .nav-link:hover {
            color: #fff;
            background: #424669;
        }
        
        .container-main {
            max-width: 1200px;
            margin: 0 auto;
            padding: 40px 20px;
        }
        
        .header-section {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 40px;
        }
        
        .header-section h1 {
            font-size: 2rem;
            font-weight: 600;
        }
        
        .add-btn {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 16px;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 8px;
            transition: transform 0.2s, box-shadow 0.2s;
        }
        
        .add-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
        }
        
        .items-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 24px;
        }
        
        .item-card {
            background: #2d3250;
            border-radius: 12px;
            overflow: hidden;
            transition: transform 0.3s, box-shadow 0.3s;
        }
        
        .item-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 12px 24px rgba(0,0,0,0.3);
        }
        
        .item-image {
            width: 100%;
            height: 200px;
            object-fit: cover;
            background: #1a1d2e;
        }
        
        .item-content {
            padding: 20px;
        }
        
        .item-title {
            font-size: 1.2rem;
            font-weight: 600;
            margin-bottom: 8px;
            color: #fff;
        }
        
        .item-description {
            color: #a8a8b3;
            font-size: 0.9rem;
            margin-bottom: 12px;
            line-height: 1.5;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }
        
        .item-meta {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-top: 12px;
            border-top: 1px solid #424669;
        }
        
        .item-price {
            font-size: 1.3rem;
            font-weight: 700;
            color: #667eea;
        }
        
        .item-actions {
            display: flex;
            gap: 8px;
        }
        
        .btn-small {
            padding: 6px 12px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 0.85rem;
            transition: all 0.2s;
        }
        
        .btn-delete {
            background: #ed4245;
            color: white;
        }
        
        .btn-delete:hover {
            background: #c23537;
        }
        
        .empty-state {
            text-align: center;
            padding: 80px 20px;
            color: #a8a8b3;
        }
        
        .empty-state i {
            font-size: 4rem;
            margin-bottom: 20px;
            opacity: 0.5;
        }
        
        .modal {
            display: none;
            position: fixed;
            z-index: 1000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            overflow-y: auto;
        }
        
        .modal-content {
            background: #2d3250;
            margin: 5% auto;
            padding: 30px;
            border-radius: 12px;
            width: 90%;
            max-width: 500px;
        }
        
        .close {
            color: #a8a8b3;
            float: right;
            font-size: 28px;
            font-weight: bold;
            cursor: pointer;
            line-height: 20px;
        }
        
        .close:hover {
            color: #fff;
        }
        
        .form-group {
            margin-bottom: 20px;
        }
        
        .form-group label {
            display: block;
            margin-bottom: 8px;
            color: #fff;
            font-weight: 500;
        }
        
        .form-control {
            width: 100%;
            padding: 12px;
            border: 1px solid #424669;
            border-radius: 6px;
            background: #1a1d2e;
            color: #fff;
            font-size: 14px;
        }
        
        .form-control:focus {
            outline: none;
            border-color: #667eea;
        }
        
        textarea.form-control {
            resize: vertical;
            min-height: 80px;
        }

        select.form-control {
            cursor: pointer;
        }

        input[type="file"].form-control {
            padding: 8px;
        }
    </style>
</head>
<body>
    <nav class="navbar">
        <div class="nav-links">
            <a href="dashboard.php" class="nav-link">
                <i class="uil uil-exchange"></i> Dashboard
            </a>
            <a href="my_items.php" class="nav-link active">
                <i class="uil uil-box"></i> My Items
            </a>
        </div>
        <a href="logout.php" class="nav-link">Logout</a>
    </nav>

    <div class="container-main">
        <div class="header-section">
            <h1>My Items for Trade</h1>
            <button class="add-btn" id="openModalBtn">
                <i class="uil uil-plus"></i> Add New Item
            </button>
        </div>

        <div class="items-grid" id="itemsGrid">
            <!-- Items will be loaded here dynamically -->
        </div>

        <div class="empty-state" id="emptyState" style="display: none;">
            <i class="uil uil-box"></i>
            <h3>No items yet</h3>
            <p>Click "Add New Item" to list your first item for trade</p>
        </div>
    </div>

    <div id="addItemModal" class="modal">
        <div class="modal-content">
            <span class="close" id="closeModalBtn">&times;</span>
            <h2 style="margin-bottom: 24px; color: #fff;">Add New Item</h2>
            <form id="addItemForm" enctype="multipart/form-data">
                <div class="form-group">
                    <label>Item Name *</label>
                    <input type="text" name="item_name" class="form-control" required placeholder="e.g., iPhone 13 Pro">
                </div>
                <div class="form-group">
                    <label>Description</label>
                    <textarea name="description" class="form-control" placeholder="Describe your item..."></textarea>
                </div>
                <div class="form-group">
                    <label>Category *</label>
                    <select name="category" class="form-control" required>
                        <option value="">Select Category</option>
                        <option value="electronics">Electronics</option>
                        <option value="clothing">Clothing</option>
                        <option value="books">Books</option>
                        <option value="furniture">Furniture</option>
                        <option value="toys">Toys & Games</option>
                        <option value="sports">Sports</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Condition *</label>
                    <select name="condition" class="form-control" required>
                        <option value="">Select Condition</option>
                        <option value="new">New</option>
                        <option value="like_new">Like New</option>
                        <option value="good">Good</option>
                        <option value="fair">Fair</option>
                        <option value="poor">Poor</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Item Image</label>
                    <input type="file" name="item_image" class="form-control" accept="image/*">
                </div>
                <button type="submit" class="add-btn" style="width: 100%; justify-content: center;">
                    <i class="uil uil-check"></i> Add Item
                </button>
            </form>
        </div>
    </div>

    <script>
        console.log('JavaScript loaded!');
        
        // Wait for DOM to load
        document.addEventListener('DOMContentLoaded', function() {
            console.log('DOM is ready!');
            
            // Get button elements
            const openBtn = document.getElementById('openModalBtn');
            const closeBtn = document.getElementById('closeModalBtn');
            const modal = document.getElementById('addItemModal');
            const form = document.getElementById('addItemForm');
            
            console.log('Open button:', openBtn);
            console.log('Close button:', closeBtn);
            console.log('Modal:', modal);
            console.log('Form:', form);
            
            // Open modal
            if (openBtn) {
                openBtn.addEventListener('click', function() {
                    console.log('Button clicked!');
                    if (modal) {
                        modal.style.display = 'block';
                        console.log('Modal opened!');
                    }
                });
            }
            
            // Close modal
            if (closeBtn) {
                closeBtn.addEventListener('click', function() {
                    console.log('Close clicked!');
                    if (modal) {
                        modal.style.display = 'none';
                        if (form) form.reset();
                    }
                });
            }
            
            // Close modal when clicking outside
            window.addEventListener('click', function(event) {
                if (event.target == modal) {
                    modal.style.display = 'none';
                    if (form) form.reset();
                }
            });
            
            // Handle form submission
            if (form) {
                form.addEventListener('submit', function(e) {
                    e.preventDefault();
                    console.log('Form submitted!');
                    
                    const formData = new FormData(this);
                    const submitBtn = this.querySelector('button[type="submit"]');
                    
                    submitBtn.disabled = true;
                    submitBtn.innerHTML = '<i class="uil uil-spinner-alt"></i> Adding...';
                    
                    fetch('add_item.php', {
                        method: 'POST',
                        body: formData
                    })
                    .then(response => response.json())
                    .then(data => {
                        console.log('Response:', data);
                        if (data.success) {
                            alert(data.message);
                            modal.style.display = 'none';
                            form.reset();
                            loadItems();
                        } else {
                            alert(data.message);
                        }
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = '<i class="uil uil-check"></i> Add Item';
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        alert('An error occurred. Please try again.');
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = '<i class="uil uil-check"></i> Add Item';
                    });
                });
            }
            
            // Load items
            loadItems();
        });

        function loadItems() {
            console.log('Loading items...');
            fetch('get_items.php')
                .then(response => response.text())
                .then(text => {
                    console.log('Get items raw response:', text);
                    try {
                        const data = JSON.parse(text);
                        console.log('Items loaded:', data);
                        if (data.success) {
                            displayItems(data.items);
                        }
                    } catch (e) {
                        console.error('JSON parse error:', e);
                        console.error('Response was:', text);
                    }
                })
                .catch(error => console.error('Error loading items:', error));
        }

        function displayItems(items) {
            const grid = document.getElementById('itemsGrid');
            const emptyState = document.getElementById('emptyState');
            
            if (items.length === 0) {
                grid.style.display = 'none';
                emptyState.style.display = 'block';
                return;
            }
            
            grid.style.display = 'grid';
            emptyState.style.display = 'none';
            
            grid.innerHTML = items.map(item => `
                <div class="item-card">
                    <img src="${item.image_path || 'https://via.placeholder.com/280x200?text=No+Image'}" 
                         alt="${escapeHtml(item.item_name)}" 
                         class="item-image" 
                         onerror="this.src='https://via.placeholder.com/280x200?text=No+Image'">
                    <div class="item-content">
                        <h3 class="item-title">${escapeHtml(item.item_name)}</h3>
                        <p class="item-description">${escapeHtml(item.description || 'No description')}</p>
                        <div class="item-meta">
                            <span class="item-price" style="color: #8BC34A;">Available for Swap</span>
                            <div class="item-actions">
                                <button class="btn-small btn-delete" onclick="deleteItem(${item.id})" title="Delete item">
                                    <i class="uil uil-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `).join('');
        }

        function escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }

        function deleteItem(itemId) {
            if (!confirm('Are you sure you want to delete this item?')) {
                return;
            }
            
            const formData = new FormData();
            formData.append('item_id', itemId);
            
            fetch('delete_item.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                console.log('Delete response:', data);
                if (data.success) {
                    alert(data.message);
                    loadItems();
                } else {
                    alert(data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred. Please try again.');
            });
        }
    </script>
</body>
</html>