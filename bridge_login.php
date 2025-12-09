<?php
// bridge_login.php - Bridge between HTML localStorage and PHP sessions
session_start();

// Add error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once 'db_connect.php';

// Check if user data is passed from JavaScript
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    header('Content-Type: application/json');
    
    $username = trim($_POST['username'] ?? '');
    $email = trim($_POST['email'] ?? '');
    
    if (!empty($username)) {
        try {
            // Try to find user in database by email or username
            $stmt = $conn->prepare("SELECT id, username, email FROM users WHERE email = ? OR username = ? LIMIT 1");
            $stmt->bind_param("ss", $email, $username);
            $stmt->execute();
            $result = $stmt->get_result();
            
            if ($result->num_rows > 0) {
                // User exists in database
                $user = $result->fetch_assoc();
                $_SESSION['user_id'] = $user['id'];
                $_SESSION['user_name'] = $user['username'];
                $_SESSION['user_email'] = $user['email'];
            } else {
                // User doesn't exist - create them
                $default_email = $email ?: $username . '@helpinghands.com';
                $default_password = password_hash('temporary123', PASSWORD_DEFAULT);
                
                // Insert with username, email, password
                $insert_stmt = $conn->prepare("INSERT INTO users (username, email, password, created_at) VALUES (?, ?, ?, NOW())");
                $insert_stmt->bind_param("sss", $username, $default_email, $default_password);
                
                if ($insert_stmt->execute()) {
                    $user_id = $insert_stmt->insert_id;
                    $_SESSION['user_id'] = $user_id;
                    $_SESSION['user_name'] = $username;
                    $_SESSION['user_email'] = $default_email;
                } else {
                    echo json_encode(['success' => false, 'message' => 'Failed to create user: ' . $insert_stmt->error]);
                    exit;
                }
                $insert_stmt->close();
            }
            $stmt->close();
            
            echo json_encode([
                'success' => true,
                'message' => 'Session created',
                'redirect' => 'my_items.php'
            ]);
        } catch (Exception $e) {
            echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
        }
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Invalid data - username is empty'
        ]);
    }
    $conn->close();
    exit;
}

// If accessed directly, check localStorage via JavaScript
?>
<!DOCTYPE html>
<html>
<head>
    <title>Connecting...</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background: #1a1d2e;
            color: white;
        }
        .loader {
            text-align: center;
        }
        .spinner {
            border: 4px solid #f3f3f3;
            border-top: 4px solid #667eea;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            animation: spin 1s linear infinite;
            margin: 0 auto 20px;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    </style>
</head>
<body>
    <div class="loader">
        <div class="spinner"></div>
        <h2>Connecting to your account...</h2>
        <p id="status">Please wait...</p>
    </div>

    <script>
        console.log('Bridge page loaded');
        
        // Get user from localStorage
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        
        console.log('Current user from localStorage:', currentUser);
        
        if (!currentUser) {
            document.getElementById('status').textContent = 'No user found. Redirecting to login...';
            setTimeout(() => {
                window.location.href = 'login_signup.html';
            }, 2000);
        } else {
            document.getElementById('status').textContent = 'Creating PHP session...';
            
            // Send to PHP to create session
            const formData = new FormData();
            formData.append('username', currentUser.username || currentUser.name || 'User');
            formData.append('email', currentUser.email || currentUser.username + '@helpinghands.com');
            
            console.log('Sending data:', {
                username: currentUser.username || currentUser.name,
                email: currentUser.email || currentUser.username + '@helpinghands.com'
            });
            
            fetch('bridge_login.php', {
                method: 'POST',
                body: formData
            })
            .then(response => {
                console.log('Response status:', response.status);
                return response.text();
            })
            .then(text => {
                console.log('Raw response:', text);
                try {
                    const data = JSON.parse(text);
                    console.log('Parsed response:', data);
                    
                    if (data.success) {
                        document.getElementById('status').textContent = 'Success! Redirecting...';
                        setTimeout(() => {
                            window.location.href = data.redirect;
                        }, 1000);
                    } else {
                        document.getElementById('status').textContent = 'Error: ' + data.message;
                    }
                } catch (e) {
                    console.error('JSON parse error:', e);
                    console.error('Response was:', text);
                    document.getElementById('status').textContent = 'Server error. Check console for details.';
                }
            })
            .catch(error => {
                console.error('Fetch error:', error);
                document.getElementById('status').textContent = 'Connection error: ' + error.message;
            });
        }
    </script>
</body>
</html>