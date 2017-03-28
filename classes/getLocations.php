<?php
	//allow access to API
	header('Access-Control-Allow-Origin: *');
	header('Access-Control-Allow-Headers: user, token');
	//use files
	require_once('classes/location.php');
	require_once('classes/activity.php');
	require_once('classes/catalogs.php');
	require_once('classes/exceptions.php');


$json = '{ "status" : 0, "locations" : [';
		$first = true;
		
		foreach(Catalogs::get_locations() as $l)
		{
			if($first) $first=false; else $json .= ',';

			$json .= ' { "id" : '.$l->get_id().',
						"lat" : "'.$l->get_lat().'",
						"long" : "'.$l->get_long().'",
						"description" : "'.$l->get_description().'"  
					}';
		}
			
		$json .= '] }';

		echo $json;

?>