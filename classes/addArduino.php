<?php
//allow access to API
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: user, token');
require_once('classes/location.php');


if(isset($_POST['txtlat']) && isset($_POST['txtlong']) && isset($_POST['txtdescription']))
{
	$l = new Location();		
	$l->set_lat($_POST['txtlat']);
	$l->set_long($_POST['txtlong']);
	$l->set_description($_POST['txtdescription']);	
		
	if($l->Add())
	{
		echo '{ "status" : 0, 
			"message" : "Location added successfully",
			"id" : '.$l->get_id().'
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