<?php
session_start();
include 'config.php';

// التأكد من نجاح الاتصال بقاعدة البيانات
if ($con->connect_error) {
    die("Connection failed: " . $con->connect_error);
}

$sql = "
    SELECT 
        tasks.*, 
        user.user_name
    FROM 
        tasks 
    INNER JOIN 
        user 
    ON 
        tasks.UserID = user.user_id
";
$result = $con->query($sql);

$tasks_arrays = [];
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $row['time_date_task'] = date('Y-m-d H:i:s', strtotime($row['time_date_task'])); // تأكيد تنسيق التاريخ
        $tasks_arrays[] = $row;
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'No tasks found']);
    exit;
}

echo json_encode($tasks_arrays);

$con->close();
?>
