<?php
session_start();
include 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $content = htmlspecialchars($_POST['textJob']);
    $myJob = $_SESSION['userID'];
    
    date_default_timezone_set('Asia/Riyadh');
    $JobTime = date('Y-m-d H:i:s');
    $stmt = $con->prepare('INSERT INTO generalposts (text_post, user_id_post, time_date_post) VALUES (?, ?, ?)');
    $stmt->bind_param('sis', $content, $myPost, $postTime);
    $stmt->execute();

    echo json_encode(['status' => 'success', 'message' => 'Post uploaded successfully without image', 'timestamp' => $postTime]);
    }

?>
