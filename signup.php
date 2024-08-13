<?php
include 'config.php';
$userName=$_POST['userName'];
$userPass=$_POST['userPassword'];
$userEmail=$_POST['userEmail'];
$userPhone=$_POST['phoneNumber'];
$userFname=$_POST['fnameInput'];
$userLname=$_POST['lnameInput'];
$userBornDate=$_POST['bornDate'];
$s="INSERT INTO user(
    user_name,
    first_name,
    last_name,
    user_email,
    user_password,
    born_date,
    phone_number
    )
VALUES(
    '$userName',
    '$userFname',
    '$userLname',
    '$userEmail',
    '$userPass',
    '$userBornDate',
    '$userPhone'
    )";
    $r=$con->query($s);
    echo "<script type='text/javascript'>alert('تم أنشاء الحساب بنجاح')</script>";
header('location:http://localhost/numwork/index.html');
?>