<?php
//allow access to API
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: user, token');
require_once('classes/location.php');
require_once('classes/activity.php');
require_once('classes/user.php');


if(isset($_POST['idlocation']) && isset($_POST['idUser']))
{
	$location = new Location($_POST['idlocation']);
	$activity = new SensorActivity();
	$activity->set_location($location);
		
	if($activity->Add($_POST['idUser']))
	{
		echo '{ "status" : 0, 
			"message" : "activity added successfully",
			"idactivity" : '.$activity->get_id().',
			"id" : '.$activity->get_location()->get_id().',
			"date" : '.$activity->get_time().'
			}';
	}
	else 
	{
		echo '{ "status" : 1, "errorMessage" : "Location no added" }';
	}	
}
else
{
	echo '{ "status" : 3, "errorMessage" : "Parameter not found" }';
}


?>