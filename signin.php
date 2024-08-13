<?php
session_start();
include 'config.php';

$userEmail = $_POST['email-login-input'];
$userPassword = $_POST['pass-login-input'];

// استخدام الاستعلامات المحضرة (Prepared Statements)
$stmt = $con->prepare("SELECT * FROM user WHERE user_email = ? AND user_password = ?");
$stmt->bind_param("ss", $userEmail, $userPassword);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $_SESSION['userID'] = $row['user_id'];
    header('Location: http://localhost/numwork/index.html');
    exit();
} else {
    // رسالة خطأ إذا كانت بيانات تسجيل الدخول غير صحيحة
    $_SESSION['login_error'] = "Invalid email or password";
    header('Location: http://localhost/numwork/index.html');
    exit();
}

$stmt->close();
$con->close();
?>
