<?php
	//use files
	require_once('connection.php');
	require_once('exceptions.php');
	require_once('location.php');
	require_once('activity.php');
	
	class Catalogs extends Connection
	{
		public static function get_activity_for_arduino($id_arduino, $date_begin, $date_end)
		{
			//open connection to MySql
			parent::open_connection();
			//initialize arrays
			$ids = array(); //array for ids
			$list = array(); //array for objects
			//query
			$query = "SELECT `id` FROM `sensoractivity` WHERE id_arduino = ? and `time` > ? and `time`< ?";
			//prepare command

			$command = parent::$connection->prepare($query);
			$command->bind_param('iss', $id_arduino, $date_begin, $date_end);
			//prepare command
			
			//execute command
			$command->execute();
			//link results
			$command->bind_result($id);
			//fill ids array
			while ($command->fetch()) array_push($ids, $id);
			//close command
			mysqli_stmt_close($command);
			//close connection
			parent::close_connection();
			//fill object array
			for ($i=0; $i < count($ids); $i++) array_push($list, new SensorActivity($ids[$i]));
			//return array
			return $list;
		}
		
		public static function get_locations()
		{
			//open connection to MySql
			parent::open_connection();
			//initialize arrays
			$ids = array(); //array for ids
			$list = array(); //array for objects
			//query
			$query = "SELECT `id` FROM `locations`";
			//prepare command
			$command = parent::$connection->prepare($query);
			//execute command
			$command->execute();
			//link results
			$command->bind_result($id);
			//fill ids array
			while ($command->fetch()) array_push($ids, $id);
			//close command
			mysqli_stmt_close($command);
			//close connection
			parent::close_connection();
			//fill object array
			for ($i=0; $i < count($ids); $i++) array_push($list, new Location($ids[$i]));
			//return array
			return $list;
		}
	}	
?>