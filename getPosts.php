<?php
session_start();
include 'config.php';

$result = mysqli_query($con, "
    SELECT 
        generalposts.*, 
        user.user_name,
        user.profile_pic 

    FROM 
        generalposts 
    INNER JOIN 
        user 
    ON 
        generalposts.user_id = user.user_id
");

$posts_arrays=[];
while($row = mysqli_fetch_array($result)){

    $posts_arrays[]=$row;
    
}
echo json_encode($posts_arrays);


?>