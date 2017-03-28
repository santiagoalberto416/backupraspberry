var urlServer = 'https://croissant-santy-ruler.c9users.io/croissant-web/classes/';//modificar una vez se cambie de nombre a la carpeta
var visibleLayout = true;
//var urlImages 
var x = new XMLHttpRequest();
var idLocation = 0; 
var myVar;
//i need timer every time anyone pass in front activate the div for 30 seconds

//calling start methods
showModalLocation();
setActionsToButtoms();

var playingSound = false
var soundLoaded = false

$( document ).ready(function() {
    console.log( "ready!" );
        soundLoaded = true
});


    
var socket = io.connect();
      socket.on('removeScreen', function(msg){
      	if(msg.includes("encender")){
      		hideModalDarkLayer();
			showSmartDisplay();
      	}else if(msg.includes("apagar")){
      		showModalDarkLayer();
      	}
        var message = JSON.parse(msg);
        console.log(msg);
        console.log("the id from the client is:"+message["locationid"]);
        if(message["locationid"] == idlocation){
        	hideModalDarkLayer();
			showSmartDisplay(); //¿Aquí se debe mostrar Smart Display?
	        clearTimeout(myVar);
	        myVar = setTimeout(showModalDarkLayer, 20000);
	        
	        if(playingSound == false && soundLoaded == true){
		        playingSound = true
		        $(".audioDemo").trigger('play');
		        $(".audioDemo").bind("canplaythrough", function () {
				        setTimeout(function(){
				        	$('.audioDemo').each(function(){
							    this.pause(); // Stop playing
							    this.currentTime = 0; // Reset time
							}); 
				        },
				        7000);
				});
	        }
        }
      });
      
  //  	img {opacity:0;
		// -moz-transition: opacity 2s; /* Firefox 4 */
		// -webkit-transition: opacity 2s; /* Safari and Chrome */
		// -o-transition: opacity 2s;
		// transition: opacity 2s;
		// }
      
      
      socket.on('showImage', function(msg){
        var message = JSON.parse(msg);
        var imguser = message["imageurl"];
        var nameUser = message["firstname"];
        animationImage(imguser)
        $("#user-name").text("Hola "+nameUser+" es un gusto tenerte de vuelta");
        console.log(msg);
        }
      );
      
function animationImage(imguser){
	$("#img-user").fadeOut(function() { 
	  $(this).load(function() { $(this).fadeIn(); }); 
	  $(this).attr("src",urlServer+"user-images/"+imguser);
	}); 
}

function showModalDarkLayer(){
	playingSound = false
	var ventana = document.getElementById("layerDark");
    ventana.style.display = "block";
}

function stopAudio(){
  //pause playing
  $(".audioDemo").trigger('pause');
  //set play time to 0
  $(".audioDemo").prop("currentTime",0);
}

function hideModalDarkLayer(){
	var ventana = document.getElementById("layerDark");
    ventana.style.display = "none";
	
}
/**Created Dalia Pinto*/
function showSmartDisplay(){
	var ventana = document.getElementById("presentation");
	var logo = document.getElementById("photo");
	var picture = document.getElementById("img-user");
	var username = document.getElementById("user-name");
	var qrTxt = document.getElementById("qr-content");
	var qrImage = document.getElementById("qr-img1");
	var app = document.getElementById("app");
	ventana.style.display = "inline";
	picture.style.display = 'inline';
	username.style.display = 'inline';
	logo.style.display = "inline";
	qrTxt.style.display = "inline";
	qrImage.style.display = "inline";
	app.style.display = 'inline';
}

function showModalLocation()
{
    var ventana = document.getElementById("miVentana");
    ventana.style.display = "block";
}

function hideModalLocation()
{
    var ventana = document.getElementById("miVentana");
    ventana.style.display = "none";
}

function setActionsToButtoms(){
	// check the id of the location
	document.getElementById("btnAccept").onclick = function() { getIdLocations(); }
}

function getIdLocations(){
	var txtIdLocation = document.getElementById("idlocation").value;
	if(txtIdLocation != '' && isNaN(txtIdLocation) == false){
		if(txtIdLocation > 0){
			console.log("numeric value valid");
			validateIdArduino(txtIdLocation);
		}
	}else{
		alert("put a numeric value and dont let empty");
	}
}

function validateIdArduino(id){
	idlocation = id;

	x.open('POST', urlServer + 'getLocation.php', true);
	//send request
	var data = new FormData();
	data.append('idLocation', idlocation);

	x.send(data);
	//event handler
	x.onreadystatechange = function()
	{
		if(x.status ==200 & x.readyState == 4)
		{
			console.log(x.responseText);
			var location = JSON.parse(x.responseText);
			if(location["status"]==0){
				//alert("location valid");
				hideModalLocation();
				hideModalDarkLayer(); //¿Temporal?
				showSmartDisplay();

			}else{
				alert("location invalid");
			}
			
		}
	}
	
}


