//global variables
var urlServer = 'http://localhost/friendlydisplays/classes/';
var x = new XMLHttpRequest();
var actualdate = "";
var locationId = 0;
/**
	this function get the locations from the api
	getLocations.php

	its called in onLoad (html)
*/
function getLocations(){	
	//request
	x.open('GET', urlServer + 'getLocations.php', true);
	//send request
	x.send();
	//event handler
	x.onreadystatechange = function()
	{
		if(x.status ==200 & x.readyState == 4)
		{
			var data = (x.responseText);
			//console.log(data);
			
			var JSONdata = JSON.parse(data);			
			var locations = JSONdata.locations;				
			
			for(var i = 0; i < locations.length; i++)
			{
				showSelectLocations(locations[i]);
			}
		}
	}
	
}
//show data in combobox
// called in getLocations method
function showSelectLocations(data){
	//console.log(data);	
	var selectLocation = document.getElementById('select_location');
	var option = document.createElement('option');	
	option.value = data.id;
	option.text = data.description + ": " + data.lat + ", " + data.long;	
	selectLocation.appendChild(option); 	
}
//contains the select and datepicker values.
// its called in button "show Graph"
function getGraphs(){
	var date = document.getElementById('datepicker').value;

	locationId = document.getElementById('select_location').value;
	actualdate = document.getElementById('datepicker').value;

	x.open('GET', urlServer + 'getActivities.php?idLocation=' + locationId + '&beginDate=' + date, true);
	//send request
	x.send();
	
	x.onreadystatechange = function()
	{
		if(x.status ==200 & x.readyState == 4)
		{
			//send activities
			var data = JSON.parse(x.responseText);
			svgGraphs(data);
			
			//localstorage data
			localStorage.setItem('location', data.location.description);
			localStorage.setItem('beginDate', date);

		}
	}
	
}
/*
* Init timer
*/
function init()
{
	setInterval('getGraphs();', 1000);
	//readData();
}
/*
* show graphs in SVG
*/
function svgGraphs(data){
	//console.log(data);
	
	//console.log("***** data chart :"+ data);
	var location = localStorage.getItem('location');
	var date = localStorage.getItem('beginDate');
	var ctx = document.getElementById("myChart");
	
	var title = document.getElementById('title-svg');
	title.innerHTML = 'Inflow of people per hour from ' + location + ' in date: ' + date;
	var activities = data.activities;
	
	
		for (var i = 0; i < activities.length; i++)
		{
			var activity = activities[i].activity;
			//console.log(activitiesArray);
			var height = activity * .4;
			console.log(height);
			var y = 90 - height;
			//column
			var c = document.getElementById('column' + i);
			c.style.height = height + '%';
			c.style.y = y + '%';
			c.style.fill = '#097A73';
			c.style.stroke = '#00BCD4';
			//value
			var v = document.getElementById('value' + i);
			if(activity == 0)
				v.innerHTML = '';
			else				
				v.innerHTML = activity + '%';
				v.setAttribute('y', (y-1) + '%');
				v.style.fill = '#097A73';
		}
	}	

/**This functions add the location
send to API*/
function addLocation(){
	//get inputs values
	var txtlat = document.getElementById('txtlat').value;
	var txtlong = document.getElementById('txtlong').value;
	var txtdescription = document.getElementById('txtdescription').value;
	//request
	x.open('POST', urlServer + 'addArduino.php', true);
	//send request
	var data = new FormData();
	data.append('txtlat', txtlat);
	data.append('txtlong', txtlong);
	data.append('txtdescription', txtdescription);
	//send data
	x.send(data);
	//event handler
	x.onreadystatechange = function()
	{
		if(x.status ==200 & x.readyState == 4)
		{
			console.log(x.responseText);
			var JSONdata = JSON.parse(x.responseText);
			alert('location added');
			txtlat = '';
			txtlong = '';
			txtdescription='';
		}
	}
}

