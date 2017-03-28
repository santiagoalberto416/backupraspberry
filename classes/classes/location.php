<?php
	//use files
	require_once('connection.php');
	require_once('exceptions.php');

	class Location extends Connection
	{
		//attributes
		private $id;
		private $lat;
		private $long;
		private $active;
		private $description;
		//methods
		public function get_id() { return $this->id; }
		public function set_id($value) { $this->id = $value; }
		public function get_lat() { return $this->lat; }
		public function set_lat($value) { $this->lat= $value; }
		public function get_long() { return $this->long; }
		public function set_long($value) { $this->long= $value; }
		public function get_description() { return $this->description; }
		public function set_description($value) { $this->description= $value; }
		
		
		//constructor
		function __construct()
		{
			//if no arguments received, create empty object
			if(func_num_args() == 0)
			{
				$this->id = 0;
				$this->lat = 0.0;
				$this->long = 0.0;
				$this->active = 'n';
				$this->description = '';
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
				$query = "SELECT `id`, `latitude`, `lenght`, `active`, `description` FROM `locations` WHERE `id` = ?";
				//prepare command
				$command = parent::$connection->prepare($query);
				//link parameters
				$command->bind_param('s', $idlocation);
				//execute command
				$command->execute();
				//link results to class attributes
				$command->bind_result($this->id, $this->lat, $this->long, $this->active, $this->description);
				//fetch data
				$found = $command->fetch();
				//close command
				mysqli_stmt_close($command);
				//close connection
				parent::close_connection();
				//if not found throw exception
				if(!$found){
					$this->id = 0;
					$this->lat = 0.0;
					$this->long = 0.0;
					$this->active = 'n';
					$this->description = '';
				}
			}
		}

		public function Add()
		{
			parent::open_connection();
			$query = "INSERT INTO `locations`(`latitude`, `lenght`, `active`, `description`) VALUES (?,?,'A',?)";
			$command = parent::$connection->prepare($query);
			//$userid = $this->user->get_id();
			$command->bind_param('dds', $this->lat, $this->long, $this->description);
			$added = $command->execute();
			$id = $command->insert_id;
			$this->id = $id;
			mysqli_stmt_close($command);
			parent::close_connection();
			return $added;
		}
		
		public function Deleted()
		{
			parent::open_connection();
			$query = "DELETE FROM `locations` WHERE id = ?";
			$command = parent::$connection->prepare($query);
			$command->bind_param('i', $this->id);
			$deleted = $command->execute();
			mysqli_stmt_close($command);
			parent::close_connection();
			return $deleted;
		}
		public function Update()
		{
			parent::open_connection();
			$query = "UPDATE `locations` SET `latitude`=?,`lenght`=?,`active`=?,`description`=? WHERE `id`= ?";
			$command = parent::$connection->prepare($query);
			$command->bind_param('iiss', $this->lat, $this->lenght, $this->active, $this->description);
			$updated = $command->execute();
			mysqli_stmt_close($command);
			parent::close_connection();
			return $updated;
		}
		
		
	}
	
	
?>
