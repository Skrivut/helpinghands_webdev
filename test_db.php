<?php
echo "<h2>Testing Database Connection...</h2>";

$db_host = 'localhost';
$db_user = 'root';
$db_pass = '';
$db_name = 'swap_share_db';
$db_port = 3307;

echo "<p>Trying to connect with:</p>";
echo "<ul>";
echo "<li>Host: " . $db_host . "</li>";
echo "<li>Port: " . $db_port . "</li>";
echo "<li>User: " . $db_user . "</li>";
echo "<li>Password: " . (empty($db_pass) ? "(empty)" : "(set)") . "</li>";
echo "<li>Database: " . $db_name . "</li>";
echo "</ul>";

// IMPORTANT: Add $db_port as the 5th parameter
$conn = new mysqli($db_host, $db_user, $db_pass, $db_name, $db_port);

if ($conn->connect_error) {
    echo "<p style='color: red;'>❌ Connection FAILED: " . $conn->connect_error . "</p>";
} else {
    echo "<p style='color: green;'>✅ Connected successfully to database!</p>";

    $result = $conn->query("SHOW TABLES LIKE 'users'");
    if ($result->num_rows > 0) {
        echo "<p style='color: green;'>✅ 'users' table exists!</p>";

        $result = $conn->query("DESCRIBE users");
        echo "<h3>Table Structure:</h3><ul>";
        while ($row = $result->fetch_assoc()) {
            echo "<li><strong>" . $row['Field'] . "</strong> - " . $row['Type'] . "</li>";
        }
        echo "</ul>";

        echo "<p style='color: green; font-weight: bold;'>🎉 Everything is set up correctly!</p>";
    } else {
        echo "<p style='color: orange;'>⚠️ Database exists but 'users' table is missing!</p>";
    }

    $conn->close();
}
