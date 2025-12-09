<?php
require_once 'db_connect.php';

if ($conn) {
    echo "DB Connection OK!";
} else {
    echo "FAILED: " . mysqli_connect_error();
}
?>
