<?php
//allow access to API
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: user, token');
require_once('classes/user.php');


if(isset($_POST['first_name']) && isset($_POST['last_name']) && isset($_POST['image'])  && isset($_POST['password']) && isset($_POST['email']))
{
    
    /*
    parameters:
    first_name
    last_name
    image
    password
    email
    */
    
	$l = new User();		
	$l->set_first_name($_POST['first_name']);	
	$l->set_last_name($_POST['last_name']);	
	$l->set_user_image($_POST['image']);	
	$l->set_password($_POST['password']);	
	$l->set_email($_POST['email']);	
		
	if($l->Add())
	{
		echo '{ "status" : 0, 
			"message" : "user added successfully",
			"id" : '.$l->get_id().',
			"first_name" : "'.$l->get_first_name().'",
			"last_name" : "'.$l->get_last_name().'",
			"image" : "'.$l->get_user_image().'",
			"email" : "'.$l->get_email().'"
			}';
	}
	else 
	{
		echo '{ "status" : 1, "errorMessage" : "user no added" }';
	}	
}
else
{
	echo '{ "status" : 3, "errorMessage" : "Parameter not found" }';
}


?>