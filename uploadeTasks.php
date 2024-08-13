<?php
session_start();
include 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // التحقق من أن البيانات ليست فارغة
    if (isset($_POST['taskDescription'], $_POST['taskTitle'], $_POST['mainCategory'], $_POST['subCategory'], $_POST['taskBudget'])) {
        $taskDescription = htmlspecialchars($_POST['taskDescription']);
        $myTask = $_SESSION['userID'];
        $taskTitle = $_POST['taskTitle'];
        $MainCategoryId = $_POST['mainCategory'];
        $SubCategoryID = $_POST['subCategory'];
        $TaskBudget = $_POST['taskBudget'];
        $technologies = isset($_POST['technologies']) ? $_POST['technologies'] : [];

        date_default_timezone_set('Asia/Riyadh');
        $taskTime = date('Y-m-d H:i:s');

        // تأكيد الاتصال بقاعدة البيانات
        if ($con->connect_error) {
            die("Connection failed: " . $con->connect_error);
        }

        $stmt = $con->prepare('INSERT INTO tasks (ProjectName, ProjectDescription, MainCategoryID, SubCategoryID, Budget, UserID, time_date_task) VALUES (?, ?, ?, ?, ?, ?, ?)');
        if ($stmt) {
            $stmt->bind_param('sssssis', $taskTitle, $taskDescription, $MainCategoryId, $SubCategoryID, $TaskBudget, $myTask, $taskTime);
            if ($stmt->execute()) {
                $projectId = $stmt->insert_id;

                // إدراج التقنيات المختارة في جدول الربط
                $techInsertStmt = $con->prepare('INSERT INTO project_technologies (project_id, technology_name) VALUES (?, ?)');
                if ($techInsertStmt) {
                    foreach ($technologies as $technology) {
                        $techInsertStmt->bind_param('is', $projectId, $technology);
                        $techInsertStmt->execute();
                    }
                    $techInsertStmt->close();
                }

                echo json_encode(['status' => 'success', 'message' => 'Post uploaded successfully without image', 'timestamp' => $taskTime]);
                header("Location: index.html");
                exit();
            } else {
                echo json_encode(['status' => 'error', 'message' => 'Failed to execute statement']);
            }
            $stmt->close();
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Failed to prepare statement']);
        }

        $con->close();
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Incomplete data']);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method']);
}
?>
