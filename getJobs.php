<?php
session_start();
include 'config.php';

$result = mysqli_query($con, "SELECT * FROM jobs");
$jobs_arrays=[];
while($row = mysqli_fetch_array($result)){
    $jobs_arrays[]=$row;
    
}
echo json_encode($jobs_arrays);


?>
