<?php
//allow access to API
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: user, token');
require_once('classes/user.php');


if(isset($_POST['user_name']))
{
    /*
    parameters:
    user_name
    password
    */
    if($_POST['password']){
        $l = new User($_POST['user_name'], $_POST['password']);
        if($l->get_id()>0){
            echo '{ "status" : 0, 
            "id" : '.$l->get_id().',
            "first_name" : "'.$l->get_first_name().'",
            "last_name" : "'.$l->get_last_name().'",
            "image" : "'.$l->get_user_image().'"
            }';
        }else{
            echo '{ "status" : 2, "errorMessage" : "Incorrect Password" }';
        }
    }
	else 
	{
	    $l = new User($_POST['user_name']);
	    if($l->get_id()>0){
            echo '{ "status" : 0, 
            "id" : '.$l->get_id().',
            "first_name" : "'.$l->get_first_name().'",
            "last_name" : "'.$l->get_last_name().'",
            "image" : "'.$l->get_user_image().'"
            }';
        }else{
            echo '{ "status" : 2, "errorMessage" : "User Not Found" }';
        }
	}	
}
else
{
	echo '{ "status" : 3, "errorMessage" : "Parameter not found" }';
}


?>