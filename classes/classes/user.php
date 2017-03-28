<?php
	//use files
	require_once('connection.php');
	require_once('exceptions.php');

	class User extends Connection
	{
		//attributes
		private $id;
		private $first_name;
		private $last_name;
		private $user_image;
		private $password;
		private $email;
		//methods
		public function get_id() { return $this->id; }
		public function set_id($value) { $this->id = $value; }
		public function get_first_name() { return $this->first_name; }
		public function set_first_name($value) { $this->first_name = $value; }
		public function get_last_name() { return $this->last_name; }
		public function set_last_name($value) { $this->last_name = $value; }
		public function get_user_image() { return $this->user_image; }
		public function set_user_image($value) { $this->user_image = $value; }
		public function get_password() { return $this->password; }
		public function set_password($value) { $this->password = $value; }
		public function get_email() { return $this->email; }
		public function set_email($value) { $this->email = $value; }
		
		
		//constructor
		function __construct()
		{
			//if no arguments received, create empty object
			if(func_num_args() == 0)
			{
				$this->id = 0;
				$this->first_name = "";
				$this->last_name = "";
				$this->user_image = "";
				$this->password = "";
				$this->email = "";
			}
			//if one argument received create object with data
			elseif(func_num_args() == 1)
			{
				//receive arguments into an array
				$args = func_get_args();
				//id
				$iduser = $args[0];
				//open connection to MySql
				parent::open_connection();
				//query
				$query = "SELECT `iduser`, `first_name`, `last_name`, `user_image`, `email` FROM `user` WHERE `email` = ?";
				//prepare command
				$command = parent::$connection->prepare($query);
				//link parameters
				$command->bind_param('s', $iduser);
				//execute command
				$command->execute();
				//link results to class attributes
				$command->bind_result($this->id, $this->first_name, $this->last_name, $this->user_image, $this->email);
				//fetch data
				$found = $command->fetch();
				//close command
				mysqli_stmt_close($command);
				//close connection
				parent::close_connection();
				//if not found throw exception
				if(!$found){
					$this->id = 0;
    				$this->first_name = "";
    				$this->last_name = "";
    				$this->user_image = "";
    				$this->password = "";
    				$this->email = "";
				}
			}
			elseif(func_num_args() == 2)
			{
				//receive arguments into an array
				$args = func_get_args();
				//id
				$user = $args[0];
				$password = $args[1];
				//open connection to MySql
				parent::open_connection();
				//query
				$query = "SELECT `iduser`, `first_name`, `last_name`, `user_image`, `email` FROM `user` WHERE email = ? and password = ?";
				//prepare command
				$command = parent::$connection->prepare($query);
				//link parameters
				$command->bind_param('ss', $user, $password);
				//execute command
				$command->execute();
				//link results to class attributes
				$command->bind_result($this->id, $this->first_name, $this->last_name, $this->user_image, $this->email);
				//fetch data
				$found = $command->fetch();
				//close command
				mysqli_stmt_close($command);
				//close connection
				parent::close_connection();
				//if not found throw exception
				if(!$found){
					$this->id = 0;
    				$this->first_name = "";
    				$this->last_name = "";
    				$this->user_image = "";
    				$this->password = "";
    				$this->email = "";
				}
			}
		}

		public function Add()
		{
			parent::open_connection();
			$query = "INSERT INTO `user`(`iduser`, `password`, `first_name`, `last_name`, `user_image`, `email`) VALUES (null,?,?,?,?,?)";
			$command = parent::$connection->prepare($query);
			//$userid = $this->user->get_id();
			$command->bind_param('sssss', $this->password, $this->first_name, $this->last_name, $this->user_image, $this->email);
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
			$query = "DELETE FROM `user` WHERE id = ?";
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
			$query = "UPDATE `user` SET `first_name`=?,`last_name`=?,`user_image`=?,`email`=?,`password`=? WHERE `id`= ?";
			$command = parent::$connection->prepare($query);
			$command->bind_param('sssss', $this->first_name, $this->last_name, $this->user_image, $this->email, $this->password);
			$updated = $command->execute();
			mysqli_stmt_close($command);
			parent::close_connection();
			return $updated;
		}
		
		
	}
	
	
?>