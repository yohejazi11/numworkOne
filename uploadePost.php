<?php
session_start();
include 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $content = htmlspecialchars($_POST['textPost']);
    $myPost = $_SESSION['userID'];
    
    date_default_timezone_set('Asia/Riyadh');
    $postTime = date('Y-m-d H:i:s');

    // التأكد من وجود ملف
    if (isset($_FILES['postImage']) && $_FILES['postImage']['error'] == 0) {
        $image = $_FILES['postImage'];
        $uploadDir = 'uploads/';
        $uploadFile = $uploadDir . basename($image['name']);
        $originalName = $image['name'];

        // التأكد من عدم وجود اسم ملف مكرر
        $counter = 1;
        while (file_exists($uploadFile)) {
            $fileParts = pathinfo($originalName);
            $newFileName = $fileParts['filename'] . '_' . $counter . '.' . $fileParts['extension'];
            $uploadFile = $uploadDir . $newFileName;
            $counter++;
        }

        // نقل الملف إلى مجلد الرفع
        if (move_uploaded_file($image['tmp_name'], $uploadFile)) {
            // حفظ البيانات في قاعدة البيانات
            $stmt = $con->prepare('INSERT INTO generalposts (text_post, user_id, image_post_one, time_date_post) VALUES (?, ?, ?, ?)');
            $stmt->bind_param('siss', $content, $myPost, $uploadFile, $postTime);
            $stmt->execute();

            echo json_encode(['status' => 'success', 'message' => 'Post uploaded successfully', 'timestamp' => $postTime]);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Failed to upload image']);
        }
    } else {
        // إذا لم يتم رفع صورة
        $stmt = $con->prepare('INSERT INTO generalposts (text_post, user_id, time_date_post) VALUES (?, ?, ?)');
        $stmt->bind_param('sis', $content, $myPost, $postTime);
        $stmt->execute();

        echo json_encode(['status' => 'success', 'message' => 'Post uploaded successfully without image', 'timestamp' => $postTime]);
    }
}
?>
