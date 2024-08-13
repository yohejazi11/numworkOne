<?php
session_start();
include 'config.php';

header('Content-Type: application/json');

$action = isset($_GET['action']) ? $_GET['action'] : '';

switch ($action) {
    case 'getGallaryWork':
        getGallaryWork();
        break;
    case 'getPosts':
        getPosts();
        break;
    case 'getFollowers':
        getFollowers();
        break;
    case 'getFollowing':
        getFollowing();
        break;
    case 'getMainProfile':
        getMainProfile();
        break;
    default:
        echo json_encode(['status' => 'error', 'message' => 'Invalid action']);
}

function getGallaryWork() {
    global $con;
    $userID = $_SESSION['userID'];
    $result = $con->query("SELECT * FROM gallery_work WHERE user_id = '$userID'");
    $works = $result->fetch_all(MYSQLI_ASSOC);
    echo json_encode(['status' => 'success', 'data' => $works]);
}

function getPosts() {
    global $con;
    $userID = $_SESSION['userID'];
    $result = $con->query("SELECT * FROM generalposts WHERE user_id = '$userID'");
    $posts = $result->fetch_all(MYSQLI_ASSOC);
    echo json_encode(['status' => 'success', 'data' => $posts]);
}

function getFollowers() {
    global $con;
    $userID = $_SESSION['userID'];
    $result = $con->query("SELECT * FROM followers WHERE user_id = '$userID'");
    $followers = $result->fetch_all(MYSQLI_ASSOC);
    echo json_encode(['status' => 'success', 'data' => $followers]);
}

function getFollowing() {
    global $con;
    $userID = $_SESSION['userID'];
    $result = $con->query("SELECT * FROM following WHERE user_id = '$userID'");
    $following = $result->fetch_all(MYSQLI_ASSOC);
    echo json_encode(['status' => 'success', 'data' => $following]);
}

function getCv() {
    global $con;
    $userID = $_SESSION['userID'];
    $result = $con->query("SELECT * FROM cv WHERE user_id = '$userID'");
    $cv = $result->fetch_assoc();
    echo json_encode(['status' => 'success', 'data' => $cv]);
}

function getMainProfile() {
    global $con;
    $userID = $_SESSION['userID'];
    $result = $con->query("SELECT * FROM user WHERE user_id = '$userID'");
    $main_profile = $result->fetch_assoc();
    echo json_encode(['status' => 'success', 'data' => $main_profile]);
}
?>
