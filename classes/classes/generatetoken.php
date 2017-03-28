<?php
	function generate_token()
	{
		//today 
		$today = date_create();
		//token
		$token = '';
		//if 0 arguments received, generate token with date only
		if(func_num_args() == 0)
		{
			//generate token
			$token = sha1(date_format($today, 'Ymd'));
		}
		// if 1 argument received, generate token with user and date
		if(func_num_args() == 1)
		{
			//get user id
			$args = func_get_args();
			$user_id = $args[0];
			//generate token
			$token = sha1($user_id.(date_format($today, 'Ymd')));
		}
		//return token
		return $token;
	}
?>