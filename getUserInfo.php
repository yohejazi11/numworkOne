<?php
session_start();
header('Content-Type: application/json');

// افترض أن الاتصال بقاعدة البيانات موجود في هذا الملف
include 'config.php';

$response = array('user_id' => 0); // القيمة الافتراضية إذا لم يكن المستخدم مسجل الدخول

if (isset($_SESSION['userID'])) {
    $userID = $_SESSION['userID'];
    $stmt = $con->prepare("SELECT * FROM user WHERE user_id = ?");
    $stmt->bind_param("i", $userID);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $response = $result->fetch_assoc();
    }
}

echo json_encode($response);
?>