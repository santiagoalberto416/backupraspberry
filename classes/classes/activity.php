<?php

/*Update by Dalia 01/04*/

	//use files
	require_once('connection.php');
	require_once('exceptions.php');
	require_once('location.php');
	
	class SensorActivity extends Connection
	{
		//attribute
		private $id;
		private $time;
		private $location;
		
		
		//methods
		public function get_id() { return $this->id;}
		public function set_id($value) { $this->id = $value;}
		public function get_time() { return $this->time;}
		public function set_time($value) { $this->time = $value;}
		public function get_location() { return $this->location;}
		public function set_location($value) { $this->location = $value;}
		
		
		
		//Constructor
		//constructor
		function __construct()
		{
			//if no arguments received, create empty object
			if(func_num_args() == 0)
			{
				$this->id = 0;
				$this->time = date("Y-m-d H:i:s");
				$this->location = new Location();
			}
			//if one argument received create object with data
			if(func_num_args() == 1)
			{
				//receive arguments into an array
				$args = func_get_args();
				//id
				$idlocation = $args[0];
				//open connection to MySql
				parent::open_connection();
				//query
				$query = "SELECT `id`, `time`, `id_arduino` FROM `sensoractivity` WHERE `id` = ?";
				//prepare command
				$command = parent::$connection->prepare($query);
				//link parameters
				$command->bind_param('i', $idlocation);
				//execute command
				$command->execute();
				//link results to class attributes
				$command->bind_result($this->id, $this->time, $id_arduino);
				//fetch data
				$found = $command->fetch();
				//close command
				mysqli_stmt_close($command);
				//close connection
				parent::close_connection();
				//if not found throw exception
				if(!$found){
					$this->id = 0;
					$this->time = date("Y-m-d H:i:s");
					$this->location = new Location();
				}else{
					$this->location = new Location($id_arduino);
				}
			}
		}
		
		public function Add($idUser)
		{
			parent::open_connection();
			$query = "";
			
			if($idUser == 0){
					$query = "INSERT INTO `sensoractivity`(`id`, `time`, `id_arduino`, `id_user`) VALUES (NULL,NOW(),?,NULL)";
			}else{
					$query = "INSERT INTO `sensoractivity`(`id`, `time`, `id_arduino`, `id_user`) VALUES (NULL,NOW(),?,?)";
			}
			$command = parent::$connection->prepare($query);
			//$userid = $this->user->get_id();
			if($idUser == 0){
				$command->bind_param('i', $this->location->get_id());
			}else{
				$command->bind_param('ii', $this->location->get_id(), $idUser);
			}
			$added = $command->execute();
			$id = $command->insert_id;
			$this->id = $id;
			mysqli_stmt_close($command);
			parent::close_connection();
			return $added;
		}
	}
	
?>