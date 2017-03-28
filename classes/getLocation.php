<?php
//allow access to API
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
require_once('classes/location.php');
$headers = getallheaders();

if(isset($_POST['idLocation']))
{
		$m = new Location($_POST['idLocation']);
		if(is_null($m->get_id()))
			echo '{ "status" : 1, "errorMessage" : "Location not found" }';
		else if($m->get_id()==0){
			echo '{ "status" : 1, "errorMessage" : "Location not found" }';
		}else{
			echo '{ "status" : 0, "message" : "Location found",
				"id": '.$m->get_id().',
				"latitude":"'.$m->get_lat().'",
				"longitude":"'.$m->get_long().'",
				"description":"'.$m->get_description().'"
				}';
		}
		
				

}
else
{
	echo '{ "status" : 3, "errorMessage" : "Parameter not found" }';
}


?>