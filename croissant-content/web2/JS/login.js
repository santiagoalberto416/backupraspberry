
var urlServer = 'https://croissant-santy-ruler.c9users.io/croissant/';//modificar una vez se cambie de nombre a la carpeta
//var urlImages 
var x = new XMLHttpRequest();


function login()
{
	//read email and password
	var email = document.getElementById('txtEmail').value;
	var password = document.getElementById('txtPassword').value;
    console.log(email);
    console.log(password);
	//petition
	x.open('GET', urlServer + 'getusers.php'+'?email='+email+'&password='+password , true);

	//send petition
	x.send();
	//event handler
	x.onreadystatechange = function()
	{
		//check status
		if (x.readyState == 4 & x.status == 200)
		{
			//read response
			var data = x.responseText;
            var JSONdata = JSON.parse(data);
            console.log(JSONdata);
            if (JSONdata.status == 0)
			{
                sessionStorage.type = JSONdata.type;
                console.log( sessionStorage.type);
                        //redirect to index
				        switch(sessionStorage.type)
                        {
                            case '1'://admin
                            
                                localStorage.setItem('moderatorname', JSONdata.firstname + ' ' + JSONdata.lastname);
                                localStorage.setItem('nickname', JSONdata.nickname);
                                localStorage.setItem('type', JSONdata.type);
                                sessionStorage.id = JSONdata.id;
                                localStorage.setItem('idadmin', sessionStorage.id);
                                localStorage.setItem('iduser', sessionStorage.id);
                                getEventsAdmin();
                                break;
                            case '2'://Ponente
                                window.location = 'events.html';
								localStorage.setItem('moderatorname', JSONdata.firstname + ' ' + JSONdata.lastname);
                                localStorage.setItem('nickname', JSONdata.nickname);
                                localStorage.setItem('type', JSONdata.type);
                                sessionStorage.id = JSONdata.id;
                                localStorage.setItem('idspeaker', sessionStorage.id);
                                localStorage.setItem('iduser', sessionStorage.id);
                                break;
                            case '3'://Moderador
                                window.location = 'events.html';
								localStorage.setItem('moderatorname', JSONdata.firstname + ' ' + JSONdata.lastname);
                                localStorage.setItem('nickname', JSONdata.nickname);
                                localStorage.setItem('type', JSONdata.type);
                                sessionStorage.id = JSONdata.id;
                                localStorage.setItem('idmoderador', sessionStorage.id);
                                localStorage.setItem('iduser', sessionStorage.id);
                                break;
                            case '4'://asistente
                                window.location = 'events.html';
                                localStorage.setItem('moderatorname', JSONdata.firstname + ' ' + JSONdata.lastname);
                                localStorage.setItem('nickname', JSONdata.nickname);
                                localStorage.setItem('type', JSONdata.type);
                                localStorage.setItem('userId', JSONdata.id);
                                localStorage.setItem('iduser', sessionStorage.id);
                                break;
                        }
			}
			else
			{
				alert('Access Denied');
			}
		}
	}
}

/*

case '1'://admin
                                localStorage.setItem('adminname', JSONdata.firstname + ' ' + JSONdata.lastname);
                                localStorage.setItem('nickname', JSONdata.nickname);
                                localStorage.setItem('type', JSONdata.type);
                                sessionStorage.id = JSONdata.id;
                                localStorage.setItem('idadmin', sessionStorage.id);
                                getEventsAdmin();
                                break;
                            case '2'://Ponente
                                window.location = 'conferences-speaker.html';
								localStorage.setItem('moderatorname', JSONdata.firstname + ' ' + JSONdata.lastname);
                                localStorage.setItem('nickname', JSONdata.nickname);
                                localStorage.setItem('type', JSONdata.type);
                                sessionStorage.id = JSONdata.id;
                                localStorage.setItem('idspeaker', sessionStorage.id);
                                break;
                            case '3'://Moderador
                                window.location = 'conferences-moderator.html';
								localStorage.setItem('moderatorname', JSONdata.firstname + ' ' + JSONdata.lastname);
                                localStorage.setItem('nickname', JSONdata.nickname);
                                localStorage.setItem('type', JSONdata.type);
                                sessionStorage.id = JSONdata.id;
                                localStorage.setItem('idmoderador', sessionStorage.id);
                                break;
                            case '4'://asistente
                                window.location = 'conferences.html';
                                localStorage.setItem('moderatorname', JSONdata.firstname + ' ' + JSONdata.lastname);
                                localStorage.setItem('nickname', JSONdata.nickname);
                                localStorage.setItem('type', JSONdata.type);
                                localStorage.setItem('userId', JSONdata.id);
                                break;

*/

function getEventsAdmin()
{
    $.ajax({
              url: urlServer + "geteventsbyadmin.php",
              type: "POST",
              data: { 
                  userid : localStorage.getItem("idadmin")
              }
    }).done(function(data){
        var jsonResult = JSON.parse(data);
        if(jsonResult.events.length > 0){
            localStorage.setItem("idevent", jsonResult.events[0].id);
            window.location = "event-control-panel.html";
        }
        else
            window.location = "add-event.html";
    });
}

function checkUser()
{
    
    
    //check if user is logged in 
	if(sessionStorage.type == null)
	{ 
		//redirect to login page
		window.location = 'login.html';
	}
	else
	{
        switch(sessionStorage.type)
        {
           case '2'://Ponente
                window.location = 'conferences-speaker.html';
                break;
           case '3'://Moderador
                window.location = 'conferences-moderator.html';
                break;
                
           case '4'://asistente
                window.location = 'conferences.html';
                break;
        } 
	}
    
    
}