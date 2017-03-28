//global variables
var urlServer = 'https://croissant-santy-ruler.c9users.io/croissant-web/classes/';
var x = new XMLHttpRequest();
var activitiesArray= [];
var myBarChart = new Chart();
var actualdate = "";
var locationId = 0;
var socket;
var hours = ["00:00", "01:00", "02:00", "03:00", "04:00", 
    		 "05:00", "06:00", "07:00", "08:00", "09:00", 
    		 "10:00", "11:00", "12:00", "13:00", "14:00", 
    		 "15:00", "16:00", "17:00", "18:00", "19:00", 
    		 "20:00", "21:00", "22:00", "23:00"];

/**
	this function initialize the socket to receive 
	te activities from the server

	its called in on Load
*/
function initializeSocket(){
	socket = io.connect('https://smart-displays-santy-ruler.c9users.io:8081');
	
	socket.emit("removeAction", "\"locationid\" : 1 ");
	
	socket.on('uploadDataGraphic', function(msg){
			console.log("si entro "+msg);
			var data = JSON.parse(msg);
				var id = data.id;
				var day = data.date.substring(0,10);
				var hour = data.date.substring(11,13);
				var hourInt = parseInt(hour);
				if(actualdate == day && id == locationId){
					myBarChart.data.datasets[0].data[hourInt] = myBarChart.data.datasets[0].data[hourInt] + 1;
					myBarChart.update();
				}
	});
}


/**
	this function send a call to server to upload 
	the graph and is only for TEST

	IT MUST BE DELETED, but before ask kirk
	
	its called in the buton of arduino locations
*/


/*function testActivity(){

	x.open('GET', urlServer + 'testactivity.php', true);
	//send request
	x.send();
	//event handler
	x.onreadystatechange = function()
	{
		if(x.status ==200 & x.readyState == 4)
		{
			socket.emit("uploadDataGraphic", x.responseText);
		}
	}
}*/

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
			var activities = data.activities;
			//console.log(activities);			
			showDataChart(activities);
			svgGraphs(data);
			
			//localstorage data
			localStorage.setItem('location', data.location.description);
			localStorage.setItem('beginDate', date);

		}
	}
	
}

//push api activities
function arrayData(data){
	activitiesArray.push(data.activity);
	console.log(data.activity);
}
//show graphs
function showDataChart(dataChart){

	if(myBarChart!=null){
		myBarChart.destroy();
	}

	activitiesArray = [];
	console.log("***** data chart :"+ dataChart);
	var location = localStorage.getItem('location');
	var date = localStorage.getItem('beginDate');
	var ctx = document.getElementById("myChart");
	dataChart.forEach(arrayData);

	var data = {
    labels: ["00:00", "01:00", "02:00", "03:00", "04:00", 
    		 "05:00", "06:00", "07:00", "08:00", "09:00", 
    		 "10:00", "11:00", "12:00", "13:00", "14:00", 
    		 "15:00", "16:00", "17:00", "18:00", "19:00", 
    		 "20:00", "21:00", "22:00", "23:00"],
    datasets: [
	        {
	            label: "Inflow of people per hour from " + location + " in date: " + date,
	            backgroundColor: 'rgba(0, 151, 167, 0.8)',
	            borderColor: 'rgba(0, 188, 212)',
	            borderWidth: 1,				
	            data: activitiesArray
	        }
	    ]
	};

    myBarChart = new Chart(ctx, {
    type: 'bar',
    data: data,
    options: {
        responsive: false
    }
})

	/*myBarChart.data.datasets[0].data[3]= 10; // Would update the first dataset's value of 'March' to be 50
	myBarChart.update();*/
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
			alert('question added');
			txtlat = '';
			txtlong = '';
			txtdescription='';
		}
	}
}