//variables
var urlServer = 'https://croissant-santy-ruler.c9users.io/croissant/';//modificar una vez se cambie de nombre a la carpeta
//var urlImages 
var x = new XMLHttpRequest();
var socket = io.connect();
// Optional: If you're using the UI pack, require it after Velocity. (You don't need to assign it to a variable.

function showConference()
{
	var id = localStorage.getItem('id');
	if(id != null)
	{
		x.open('GET', urlServer + 'getconference.php?id='+ id, true);
		
		//send request
		x.send();
		//event handler
		x.onreadystatechange = function()
		{
			if(x.status ==200 & x.readyState == 4)
			{
				
				var conf = JSON.parse(x.responseText);
				var title = conf.title;
				var nameSpeaker = conf.speaker.name + ' ' + conf.speaker.lastname;
				var content = document.getElementById("content-absolute");
				content.children[1].innerHTML = 'Conference: ';
				content.children[2].innerHTML = title;
				content.children[3].innerHTML = 'Speaker: ';
				content.children[4].innerHTML = nameSpeaker;
				
			}
		}
	}
}

/*Informacion Moderador*/
function showInfo()
{
	var info = document.getElementById('moderator-name');
	var user = document.getElementById('user-name');
	var name = '';
	var hello = '';
    name = localStorage.getItem('moderatorname');
	hello = localStorage.getItem('str29');
    console.log(name);
	console.log(hello);
	
	info.innerHTML = hello + ', ' +name;
	user.innerHTML = hello + ', ' +name;
}

//Add Question
function addQuestion()
{
	var question = document.getElementById('textarea-question').value;
	if(question.length==0)
	{
		alert("Invalid question "+ question);
	}

	var idconf = localStorage.getItem('id');
	var idUser = localStorage.getItem('userId');

	x.open('POST', urlServer + 'addquestion.php', true);
	//send request
	var data = new FormData();
	data.append('txtquestion', question);
	data.append('txtiduser', idUser);//modificar aqui cuando este listo el login
	data.append('txtidconf', idconf);
	/// con este estatus confirmas que la pregunta todavia no se ha autorizado
	data.append('txtstatus', 'w');

	x.send(data);
	//event handler
	x.onreadystatechange = function()
	{
		if(x.status ==200 & x.readyState == 4)
		{
			console.log(x.responseText);
			var JSONdata = JSON.parse(x.responseText);
			socket.emit('sendMessage', JSONdata);//aqui
			var logo = document.getElementById("con");
			var not = document.getElementById('content-notification');
			
			var t1 = new TimelineLite();
			
			t1.to(logo, 0.5, {opacity: 1});
			t1.to(logo, 0, {display: 'none'});
			t1.to(not, 0, {display: 'inline-block'});
			if(innerWidth > 768)
			{
				t1.to(not, 0.5, {margin: '109.5px 0px 0px 168.5px'});
			}
			if(innerWidth <= 768)
			{
				t1.to(not, 0.5, {margin: '80px 0px 80px 0px'});	
			}
		}
	}
}
function newQuestion()
{
	var enviado = document.getElementById('content-notification');
	var caja = document.getElementById('con');
	
	
	var t2 = new TimelineLite();
	t2.to(enviado, 0, {opacity: 1});
	t2.to(enviado, 0, {display: 'none'});
	t2.to(caja, 0,{display: 'inline-block'});
	
	
			if(innerWidth > 768)
			{
				t2.to(caja, 0.5, {margin: '0px 0px 0px 0px'});
			}
			if(innerWidth <= 768)
			{
				t2.to(caja, 0.5, {margin: '0px 0px 0px 0px'});	
			}
	document.getElementById('textarea-question').value="";
	
}
//get Conferences
function getConferences()
{	
	//request
	x.open('POST', urlServer + 'getconferences.php', true);
	var nickname = localStorage.getItem('nickname');
	var data = new FormData();
	data.append('txtnickname', nickname );
    console.log(localStorage.getItem("idevent") + " IDEVENT");
    data.append('id_event', localStorage.getItem("idevent"));
	//data.append('txtpassword','mary1986');
	//send request
	x.send(data);
	//event handler
	x.onreadystatechange = function()
	{
		if(x.status ==200 & x.readyState == 4)
		{
			console.log(x.responseText);	
			parseConferences(x.responseText);
            console.log(nickname);
		}
	}	
}
//parse conferences
function parseConferences(data)
{
	//parse to JSON
	var JSONdata = JSON.parse(data); //console.log(JSONdata);
	//check status
	if(JSONdata.status == 0)
	{
		var JSONconferences = JSONdata.conferences; //console.log(JSONconferences);
		//create conferences array
		var conferences = [];
		conferences = JSONconferences;
		//read JSON conferences		
        var type = localStorage.getItem('type');
        switch(type)
        {
           case '2':
				showConferencesSpeaker(conferences);
				break;
            case '3':
                 showConferencesModerator(conferences);	
            break;
            case '4':
                 showConferences(conferences);	
            break;
        }
		
       
	}
}

function showConferences(confereces)
{
	/* parent of the elements */
	
	var divConferences = document.getElementById('subject-content');
	//read conferences	
	/*var id = localStorage.getItem('id');*/
	var last="";
	var name="";
	for(var i = 0; i < confereces.length; i++)
	{
		//Conferences
		var conference = confereces[i];
	
		
		var divContentinfo = document.createElement('div');
		
		
		divContentinfo.className = "content-info-conference";
		
		
		
		var tableConference = document.createElement('table');
		tableConference.className = "table-conference";
		tableConference.setAttribute('cellspacing','0');
		tableConference.setAttribute('cellpadding','0');
		tableConference.setAttribute("onClick", "ShowOne("+conference.id+");");
		
		var trTitle = document.createElement('tr');
		
		var tdTitle = document.createElement('td');
		tdTitle.className = 'td-title';
		tdTitle.setAttribute('colspan','2');
		/*                     append name of conference*/
		tdTitle.innerHTML = conference.title;
		
		trTitle.appendChild(tdTitle);
		
		var trSpeakerTR = document.createElement('tr');
		
		var trSpeaker = document.createElement('td');
		trSpeaker.className = "td-speaker";
		trSpeaker.setAttribute('colspan','2');
		
		var contentSpeaker = document.createElement('div');
		contentSpeaker.setAttribute('id', 'content-speaker');
		
		var imageUser = document.createElement('img');
		imageUser.src = "Images/user.png";
		
		var divNameSpeaker = document.createElement('div');
		divNameSpeaker.setAttribute('id', 'name-speaker');
		
		/*                             apend name of speaker*/
		divNameSpeaker.innerHTML = conference.speaker.name + " " + conference.speaker.lastname;
		
		contentSpeaker.appendChild(imageUser);
		contentSpeaker.appendChild(divNameSpeaker);
		trSpeaker.appendChild(contentSpeaker);
		
		var trConference = document.createElement('tr');
		
		var tdPlace = document.createElement('td');
		tdPlace.className = "td-info-conference";
		/*                                          apend place*/
		tdPlace.innerHTML = "<h3>" + localStorage.getItem('str30') +"</h3><br>" + conference.Place + ", "+ conference.Room;
		
		var tdHour = document.createElement('td');
		tdHour.className = "td-info-conference";
		
		var str = conference.time;
		var str = str.substring(0, 5);
		/*                                                                     * apend date             *apend hour */
		tdHour.innerHTML = "<img src='Images/calendar-w2.png'></img><br>" + conference.date + "<br>" + str + " hrs";
		
		trSpeakerTR.appendChild(trSpeaker);
		trConference.appendChild(tdPlace);
		trConference.appendChild(tdHour);
		
		
		tableConference.appendChild(trTitle);
		tableConference.appendChild(trSpeakerTR);
		tableConference.appendChild(trConference);
		
		divContentinfo.appendChild(tableConference);
		
		console.log(divContentinfo);
		
		
		divConferences.appendChild(divContentinfo);
		
		
	}	
	//}
}
function showConferencesSpeaker(confereces)
{
	/* parent of the elements */
	
	var divConferences = document.getElementById('subject-content');
	//read conferences	
	/*var id = localStorage.getItem('id');*/
	var last="";
	var name="";
	for(var i = 0; i < confereces.length; i++)
	{
		//Conferences
		var conference = confereces[i];
	
		
		var divContentinfo = document.createElement('div');
		
		
		divContentinfo.className = "content-info-conference";
		
		
		
		var tableConference = document.createElement('table');
		tableConference.className = "table-conference";
		tableConference.setAttribute('cellspacing','0');
		tableConference.setAttribute('cellpadding','0');
		tableConference.setAttribute("onClick", "ShowOneSpeaker("+conference.id+");");
		
		var trTitle = document.createElement('tr');
		
		var tdTitle = document.createElement('td');
		tdTitle.className = 'td-title';
		tdTitle.setAttribute('colspan','2');
		/*                     append name of conference*/
		tdTitle.innerHTML = conference.title;
		
		trTitle.appendChild(tdTitle);
		
		var trSpeakerTR = document.createElement('tr');
		
		var trSpeaker = document.createElement('td');
		trSpeaker.className = "td-speaker";
		trSpeaker.setAttribute('colspan','2');
		
		var contentSpeaker = document.createElement('div');
		contentSpeaker.setAttribute('id', 'content-speaker');
		
		var imageUser = document.createElement('img');
		imageUser.src = "Images/user.png";
		
		var divNameSpeaker = document.createElement('div');
		divNameSpeaker.setAttribute('id', 'name-speaker');
		
		/*                             apend name of speaker*/
		divNameSpeaker.innerHTML = conference.speaker.name + " " + conference.speaker.lastname;
		
		contentSpeaker.appendChild(imageUser);
		contentSpeaker.appendChild(divNameSpeaker);
		trSpeaker.appendChild(contentSpeaker);
		
		var trConference = document.createElement('tr');
		
		var tdPlace = document.createElement('td');
		tdPlace.className = "td-info-conference";
		/*                                          apend place*/
		tdPlace.innerHTML = "<h3>" + localStorage.getItem('str30') +"</h3><br>" + conference.Place + ", "+ conference.Room;
		
		var tdHour = document.createElement('td');
		tdHour.className = "td-info-conference";
		
		var str = conference.time;
		var str = str.substring(0, 5);
		/*                                                                     * apend date             *apend hour */
		tdHour.innerHTML = "<img src='Images/calendar-w2.png'></img><br>" + conference.date + "<br>" + str + " hrs";
		
		trSpeakerTR.appendChild(trSpeaker);
		trConference.appendChild(tdPlace);
		trConference.appendChild(tdHour);
		
		
		tableConference.appendChild(trTitle);
		tableConference.appendChild(trSpeakerTR);
		tableConference.appendChild(trConference);
		
		divContentinfo.appendChild(tableConference);
		
		console.log(divContentinfo);
		
		
		divConferences.appendChild(divContentinfo);
		
		
	}	
	//}
}

function showConferencesModerator(confereces)
{
	/* parent of the elements */
	
	var divConferences = document.getElementById('subject-content');
	//read conferences	
	/*var id = localStorage.getItem('id');*/
	var last="";
	var name="";
	for(var i = 0; i < confereces.length; i++)
	{
		//Conferences
		var conference = confereces[i];
	
		
		var divContentinfo = document.createElement('div');
		
		
		divContentinfo.className = "content-info-conference";
		
		
		
		var tableConference = document.createElement('table');
		tableConference.className = "table-conference";
		tableConference.setAttribute('cellspacing','0');
		tableConference.setAttribute('cellpadding','0');
		tableConference.setAttribute("onClick", "ShowOneModerator("+conference.id+");");
		
		var trTitle = document.createElement('tr');
		
		var tdTitle = document.createElement('td');
		tdTitle.className = 'td-title';
		tdTitle.setAttribute('colspan','2');
		/*                     append name of conference*/
		tdTitle.innerHTML = conference.title;
		
		trTitle.appendChild(tdTitle);
		
		var trSpeakerTR = document.createElement('tr');
		
		var trSpeaker = document.createElement('td');
		trSpeaker.className = "td-speaker";
		trSpeaker.setAttribute('colspan','2');
		
		var contentSpeaker = document.createElement('div');
		contentSpeaker.setAttribute('id', 'content-speaker');
		
		var imageUser = document.createElement('img');
		imageUser.src = "Images/user.png";
		
		var divNameSpeaker = document.createElement('div');
		divNameSpeaker.setAttribute('id', 'name-speaker');
		
		/*                             apend name of speaker*/
		divNameSpeaker.innerHTML = conference.speaker.name + " " + conference.speaker.lastname;
		
		contentSpeaker.appendChild(imageUser);
		contentSpeaker.appendChild(divNameSpeaker);
		trSpeaker.appendChild(contentSpeaker);
		
		var trConference = document.createElement('tr');
		
		var tdPlace = document.createElement('td');
		tdPlace.className = "td-info-conference";
		/*                                          apend place*/
		tdPlace.innerHTML = "<h3>" + localStorage.getItem('str30') + "</h3><br>" + conference.Place + ", "+ conference.Room;
		
		var tdHour = document.createElement('td');
		tdHour.className = "td-info-conference";
		
		var str = conference.time;
		var str = str.substring(0, 5);
		/*                                                                     * apend date             *apend hour */
		tdHour.innerHTML = "<img src='Images/calendar-w2.png'></img><br>" + conference.date + "<br>" + str + " hrs";
		
		trSpeakerTR.appendChild(trSpeaker);
		trConference.appendChild(tdPlace);
		trConference.appendChild(tdHour);
		
		
		tableConference.appendChild(trTitle);
		tableConference.appendChild(trSpeakerTR);
		tableConference.appendChild(trConference);
		
		divContentinfo.appendChild(tableConference);
		
		console.log(divContentinfo);
		
		
		divConferences.appendChild(divContentinfo);
		
		
	}	
	//}
}

function clearlocal()
{
	localStorage.setItem('id', 'null');
	console.log(localStorage.getItem('id'));
}

function ShowOne(id)
{
	localStorage.setItem('id', id);
	window.location.href="conference.html";
}
function ShowOneSpeaker(id)
{
	localStorage.setItem('id', id);
	window.location.href="speaker.html";
}
function ShowOneModerator(id)
{
	localStorage.setItem('id', id);
	window.location.href="moderator.html";
}

function ShowConf()
{
	var id = localStorage.getItem("id");
	
	x.open('GET', urlServer + 'getconference.php?id='+id, true);
	
	//send request
	x.send();
	//event handler
	x.onreadystatechange = function()
	{
		if(x.status ==200 & x.readyState == 4)
		{
			console.log(x.responseText);	
			var conference = JSON.parse(x.responseText);
			var str = conference.time;
			var str = str.substring(0, 5);
			document.getElementById('title-Conference').innerHTML = conference.title;
			document.getElementById('name-speaker').innerHTML = conference.speaker.name + " " + conference.speaker.lastname;
			document.getElementById('place-Conference').innerHTML = "<h3>" + localStorage.getItem('str30') +"</h3><br>" + conference.Place + ", "+ conference.Room;
			document.getElementById('info-Conference').innerHTML = "<img src='Images/calendar2.png'></img><br>" + conference.date + "<br>" + str + " hrs";
		}
	}	
	
}

function ShowConfModerator()
{
    var id = localStorage.getItem('id');
    console.log(id)
	x.open('GET', urlServer + 'getconference.php?id='+id, true);
	
	//send request
	x.send();
	//event handler
	x.onreadystatechange = function()
	{
		if(x.status ==200 & x.readyState == 4)
		{
			console.log(x.responseText);	
			var conference = JSON.parse(x.responseText);
			var str = conference.time;
			var str = str.substring(0, 5);
			document.getElementById('title-Conference').innerHTML = conference.title;
			document.getElementById('name-speaker').innerHTML = conference.speaker.name + " " + conference.speaker.lastname;
			document.getElementById('place-Conference').innerHTML = "<h3>"+ localStorage.getItem('str30') +"</h3><br>" + conference.Place + ", "+ conference.Room;
			document.getElementById('info-Conference').innerHTML = "<img src='Images/calendar2.png' style='width: 18px; margin-bottom: 3px; opacity: 0.5;'></img><br>" + conference.date + "<br>" + str + " hrs";
		}
	}	
	
}



function goToConferences(json)
{
	localStorage.setItem('userCroissantId', json.id); // Guardamos el Id de Croissant del usuario en el localStorage, para utilizarlo despues en las transacciones
	window.location = 'conferences.html'; // Redireccionamos al usuario a la pagina de conferencias
}

function loginByCroissant()
{
	// Se utilizara para hacer login normalmente, con nuestra bd
}

//load index
function checkUserType()
{
	//check if user is logged in 
	if(sessionStorage.type != null)
	{
		//user is logged in 
		//var divLogin = document.getElementById('login');
		//divLogin.innerHTML = sessionStorage.userName;
		
	}
	else
	{
		//redirect to login page
		window.location = 'login.html';
	}

}



function onLoad()
{
	showInfoUser();
}

function showInfoUser()
{
	var userFirstName = localStorage.getItem('userFirstName');
	var userMiddleName = localStorage.getItem('userMiddleName');
	var userLastName = localStorage.getItem('userLastName');
	var userFacebookId = localStorage.getItem('userFacebookId');
	
	var name = '';
	name = name + userFirstName;
	if(userMiddleName != 'undefined') name = name + ' ' + userMiddleName;
	name = name + ' ' + userLastName;
	
	var userNames = document.getElementsByClassName('user-name');
	var userImages = document.getElementsByClassName('img-user');
	
	for(i = 0; i < userNames.length; i++)
	{
		userNames[i].innerHTML = 'Hi, ' + 'Brandon I. Reyes';
		//userNames[i].innerHTML = 'Hi, ' + name;
		//userImages[i].src = 'http://graph.facebook.com/1017466691632221/picture?type=square';
		//userImages[i].src = 'http://graph.facebook.com/' + userFacebookId +'/picture?type=square';
	}
	
}

/*Tabs Information*/
/**
*All the receive question /PREGUNTAS QUE NO SE HAN MODERADO
*/

function activateNotification(){
	//alert("si se emite");
	socket.emit('newSpeaker', "example");
	
}

function showAllMessages(data)
{
	
	/**No Mover******************************/
	//get to divs 
	var divOnHold = document.getElementById('onhold');
	//divOnHold.innerHTML = '';
	
	var divSent = document.getElementById('Sent-Speaker');
	var divDenied = document.getElementById('Denied');
	
	//get to tabs
	var tabOnHold = document.getElementById('first');
	var tabSent = document.getElementById('second');
	var tabDenied = document.getElementById('last');

	
	//create container 
	var divComment = document.createElement('div');
	divComment.className = 'comment';
	divComment.style.transform = 'scale(0.1)';
	divComment.style.opacity = '0';
	
	
	//Create inside container
	var divQuestion = document.createElement('div');
	divQuestion.setAttribute('id', 'question-hold');
	divQuestion.className = 'question-comment';
	
	
	//create details container
	var divDetails = document.createElement('div');
	divDetails.className = 'details';
	
	//create name div
	var divPerson = document.createElement('div');
	divPerson.className = 'question-person';
	divPerson.innerHTML = data.user + ' ' + localStorage.getItem('str31'); //Editar aquí
	
	//create date div
	var divDate = document.createElement('div');
	divDate.className = 'question-date'; 
	divDate.innerHTML = data.date; //Editar aquí
	
	//create text container
	var divText = document.createElement('div');
	divText.innerHTML = data.question; //Editar aquí
	divText.className = 'question-text';
	divText.setAttribute("id","edit-text");
	
	//create icons container
	var divIconContainer = document.createElement('div');
	divIconContainer.setAttribute('id', data.id);
	divIconContainer.className = 'question-icons';
	
	//create div send
	var divSendIcon = document.createElement('div');
	divSendIcon.className = 'icon';
	
	// id, nuevas preguntas
	divSendIcon.setAttribute("onclick", "sentQuestion(this.parentNode.parentNode.parentNode);activateNotification();");
	
	//create img container
	var divImgSend = document.createElement('div');
	
	//create icon send
	var iconSend = document.createElement('img');
	iconSend.src = 'Images/send.png';	
	
	//create text icon
	var textSend = document.createElement('div');
	textSend.innerHTML = localStorage.getItem('str39');
	textSend.className = 'text-img';	
	
	//create div edit
	var divEditIcon = document.createElement('div');
	divEditIcon.className = 'icon';
	divEditIcon.setAttribute("onclick","editQuestion(this.parentNode.parentNode);");
	//create img container
	var divImgEdit = document.createElement('div');
	
	//create icon edit
	var iconEdit = document.createElement('img');
	iconEdit.src = 'Images/edit.png';	
	
	//create text icon
	var textEdit = document.createElement('div');
	textEdit.innerHTML = localStorage.getItem('str46');
	textEdit.className = 'text-img';	
	
	//create div decline
	var divDeclineIcon = document.createElement('div');
	divDeclineIcon.className = 'icon';
	divDeclineIcon.setAttribute('onclick', 'declineQuestion(this.parentNode.parentNode.parentNode);');
	
	//create img container
	var divImgDecline = document.createElement('div');
	
	//create icon edit
	var iconDecline = document.createElement('img');
	iconDecline.src = 'Images/delete.png';	
	
	//create text icon
	var textDecline = document.createElement('div');
	textDecline.innerHTML = localStorage.getItem('str47');
	textDecline.className = 'text-img';
	
	//create triangle
	var divTriangle = document.createElement('div');
	divTriangle.className = 'question-triangle';
	divTriangle.setAttribute("id",'triangle');
	
	//triangle image
	var imgTriangle = document.createElement('img');
	imgTriangle.src = 'Images/triangle-onhold.png';
	
	//Add name person and date to details div
	divDetails.appendChild(divDate);
	divDetails.appendChild(divPerson);	
	
	//Add details to question-onhold div
	divQuestion.appendChild(divDetails);
	
	//Add question text to comment div
	divQuestion.appendChild(divText);
	
	//Add icon send to div 
	divImgSend.appendChild(iconSend);	
	divSendIcon.appendChild(divImgSend);	
	divSendIcon.appendChild(textSend);	
	
	//Add send icon div, to container icons
	divIconContainer.appendChild(divSendIcon);
	
	//Add icon edit to div
	divImgEdit.appendChild(iconEdit);
	divEditIcon.appendChild(divImgEdit);	
	divEditIcon.appendChild(textEdit);
	
	//add edit icon div to container icons
	divIconContainer.appendChild(divEditIcon);
	
	//Add icon decline to div
	divImgDecline.appendChild(iconDecline);
	divDeclineIcon.appendChild(divImgDecline);	
	divDeclineIcon.appendChild(textDecline);
	
	//add decline icon div to container icons
	divIconContainer.appendChild(divDeclineIcon);
	
	//Add icon container to div question-onhold
	divQuestion.appendChild(divIconContainer);	
	
	var divCalis = document.createElement('div');
	
	
	
	//Add triangle img to triangle tab 
	divTriangle.appendChild(imgTriangle);
	
	divCalis.appendChild(divQuestion);
	divCalis.appendChild(divTriangle);
	
	//Add triangle tab to div comment
	divComment.appendChild(divCalis);
	
	
	
	//Add div comment to father div on-hold
	divOnHold.appendChild(divComment);
	
	var t1 = new TimelineLite();
	t1.to(divComment, 0.5, {opacity: 1, scale: 1, ease: Quart.easeOut});
}


/**
*All the sent messages to speaker
*/
function showSentMessages(data)
{
	/**No Mover******************************/
	//get to divs 
	var divOnHold = document.getElementById('onhold');
	var divSent = document.getElementById('Sent-Speaker');
	var divDenied = document.getElementById('Denied');
	
	//divSent.innerHTML='';
	
	//get to tabs
	var tabOnHold = document.getElementById('first');
	var tabSent = document.getElementById('second');
	var tabDenied = document.getElementById('last');
	
	//create container 
	var divComment = document.createElement('div');
	divComment.className = 'comment';
	divComment.style.transform = 'scale(0.1)';
	divComment.style.opacity = '0';
	
	//Create inside container
	var divQuestion = document.createElement('div');
	divQuestion.setAttribute('id', 'question-sent');
	divQuestion.className = 'question-comment';
	
	//create details container
	var divDetails = document.createElement('div');
	divDetails.className = 'details';
	
	//create name div
	var divPerson = document.createElement('div');
	divPerson.className = 'question-person';
	if(data.user != "undefined")
	divPerson.innerHTML = data.user + ' ' + localStorage.getItem('str31'); //Editar aquí
	else
	{
		divPerson.innerHTML = "User" + ' ' + localStorage.getItem('str31'); 
	}
	
	//create date div
	var divDate = document.createElement('div');
	divDate.className = 'question-date'; 
	divDate.innerHTML = data.date; //Editar aquí
	
	//create text container
	var divText = document.createElement('div');
	divText.innerHTML = data.question; //Editar aquí
	divText.className = 'question-text';
	
	
	//create icons container
	var divIconContainer = document.createElement('div');
	divIconContainer.setAttribute('id', data.id);
	divIconContainer.className = 'question-icons';
	
	//create div send
	var divUndoIcon = document.createElement('div');
	divUndoIcon.className = 'icon';
	divUndoIcon.setAttribute("onClick", "deleteQuestion(this.parentNode.parentNode);");
	
	//create img container
	var divImgUndo = document.createElement('div');
	
	//create icon send
	var iconUndo = document.createElement('img');
	iconUndo.src = 'Images/visto.png';	
	
	//create text icon
	var textUndo = document.createElement('div');
	textUndo.innerHTML = localStorage.getItem('str32');
	textUndo.className = 'texto-send';	
	
	//Add icon send to div 
	divImgUndo.appendChild(iconUndo);	
	divUndoIcon.appendChild(divImgUndo);	
	divUndoIcon.appendChild(textUndo);	
	
	//Add send icon div, to container icons
	divIconContainer.appendChild(divUndoIcon);
	
	//create triangle
	var divTriangle = document.createElement('div');
	divTriangle.className = 'question-triangle';
	
	//triangle image
	var imgTriangle = document.createElement('img');
	imgTriangle.src = 'Images/triangle-sent.png';
	
	//Add name person and date to details div
	divDetails.appendChild(divDate);
	divDetails.appendChild(divPerson);	
	
	//Add details to question-onhold div
	divQuestion.appendChild(divDetails);
	
	//Add question text to comment div
	divQuestion.appendChild(divText);
	
	//Add div question-onhold to div comment
	divComment.appendChild(divQuestion);
	
	//Add icon container to div question-onhold
	divQuestion.appendChild(divIconContainer);	
	
	//Add triangle img to triangle tab 
	divTriangle.appendChild(imgTriangle);
	
	//Add triangle tab to div comment
	divComment.appendChild(divTriangle);
	
	//Add div comment to father div on-hold
	divSent.appendChild(divComment);
	
	var t1 = new TimelineLite();			
	t1.to(divComment, 0.5, {opacity: 1, scale: 1, ease: Quart.easeOut});
}

/**
*All the decline messages
*/
function showDeclineMessages(data)
{
	/**No Mover******************************/
	//get to divs 
	var divOnHold = document.getElementById('onhold');
	var divSent = document.getElementById('Sent-Speaker');
	var divDenied = document.getElementById('Denied');

	
	//create container 
	var divComment = document.createElement('div');
	divComment.className = 'comment';
	divComment.style.transform = 'scale(0.1)';
	divComment.style.opacity = '0';
	
	//Create inside container
	var divQuestion = document.createElement('div');
	divQuestion.setAttribute('id', 'question-denied');
	divQuestion.className = 'question-comment';
	
	//create details container
	var divDetails = document.createElement('div');
	divDetails.className = 'details';
	
	//create name div
	var divPerson = document.createElement('div');
	divPerson.className = 'question-person';
	divPerson.innerHTML = data.user + ' ' + localStorage.getItem('str31'); //Editar aquí
	
	//create date div
	var divDate = document.createElement('div');
	divDate.className = 'question-date'; 
	divDate.innerHTML = data.date; //Editar aquí
	
	//create text container
	var divText = document.createElement('div');
	divText.innerHTML = data.question; //Editar aquí
	divText.className = 'question-text';
	
	//create icons container
	var divIconContainer = document.createElement('div');
	divIconContainer.className = 'question-icons';
	divIconContainer.setAttribute('id', data.id);
	
	//create div send
	var divSendIcon = document.createElement('div');
	divSendIcon.className = 'icon';
	divSendIcon.setAttribute("onclick", "sentQuestion(this.parentNode.parentNode.parentNode);");
	
	//create img container
	var divImgSend = document.createElement('div');
	
	//create icon send
	var iconSend = document.createElement('img');
	iconSend.src = 'Images/send.png';	
	
	//create text icon
	var textSend = document.createElement('div');
	textSend.innerHTML = localStorage.getItem('str39');
	textSend.className = 'text-img';	


//Add icon send to div 
	divImgSend.appendChild(iconSend);	
	divSendIcon.appendChild(divImgSend);	
	divSendIcon.appendChild(textSend);	
	
	divSendIcon.style.display = "none";
	
	//Add send icon div, to container icons
	divIconContainer.appendChild(divSendIcon);
	
	//create div send
	var divUndoIcon = document.createElement('div');
	divUndoIcon.className = 'icon';
	divUndoIcon.setAttribute("onClick", "ReturnQuestion(this.parentNode.parentNode.parentNode);");
	
	//create img container
	var divImgUndo = document.createElement('div');
	
	//create icon send
	var iconUndo = document.createElement('img');
	iconUndo.src = 'Images/undo.png';	
	
	//create text icon
	var textUndo = document.createElement('div');
	textUndo.innerHTML = localStorage.getItem('str43');
	textUndo.className = 'texto-img';	
	
	//create div edit
	var divDeleteIcon = document.createElement('div');
	divDeleteIcon.className = 'icon';
	divDeleteIcon.setAttribute("onclick", "deleteQuestion(this.parentNode.parentNode);")
	
	//create img container
	var divImgDelete = document.createElement('div');
	
	//create icon edit
	var iconDelete = document.createElement('img');
	iconDelete.src = 'Images/denied-.png';	
	
	//create text icon
	var textDelete = document.createElement('div');
	textDelete.innerHTML = localStorage.getItem('str44');
	textDelete.className = 'texto-img';
	
	//create triangle
	var divTriangle = document.createElement('div');
	divTriangle.className = 'question-triangle';
	
	//triangle image
	var imgTriangle = document.createElement('img');
	imgTriangle.src = 'Images/triangle-denied.png';
	
	//Add name person and date to details div
	divDetails.appendChild(divDate);
	divDetails.appendChild(divPerson);	
	
	//Add details to question-onhold div
	divQuestion.appendChild(divDetails);
	
	//Add question text to comment div
	divQuestion.appendChild(divText);
	
	//Add icon send to div 
	divImgUndo.appendChild(iconUndo);	
	divUndoIcon.appendChild(divImgUndo);	
	divUndoIcon.appendChild(textUndo);	
	
	//Add send icon div, to container icons
	divIconContainer.appendChild(divUndoIcon);
	
	//Add icon edit to div
	divImgDelete.appendChild(iconDelete);
	divDeleteIcon.appendChild(divImgDelete);	
	divDeleteIcon.appendChild(textDelete);
	
	//add edit icon div to container icons
	divIconContainer.appendChild(divDeleteIcon);
	
	//Add icon container to div question-onhold
	divQuestion.appendChild(divIconContainer);	
	
	//Add div question-onhold to div comment
	divComment.appendChild(divQuestion);
	
	//Add triangle img to triangle tab 
	divTriangle.appendChild(imgTriangle);
	
	//Add triangle tab to div comment
	divComment.appendChild(divTriangle);
	
	//Add div comment to father div on-hold
	divDenied.appendChild(divComment);
	
	var t1 = new TimelineLite();			
	t1.to(divComment, 0.5, {opacity: 1, scale: 1, ease: Quart.easeOut});
}

function sentQuestion(parentdiv)
{
	var div = parentdiv.childNodes[0];
	var icons = div.childNodes[2];
	var newid = icons.getAttribute("id");
	
	console.log(newid);
	x.open('POST', urlServer + 'aceptquestion.php', true);
	//send request
	var data = new FormData();
	data.append('idquestion', newid);

	x.send(data);
	//event handler
	x.onreadystatechange = function()
	{
		if(x.status ==200 & x.readyState == 4)
		{
			console.log(x.responseText);
			var jsondata = JSON.parse(x.responseText);
			socket.emit('sendSpeaker', jsondata);
		}
	}
	icons.style.display = "none";
	div.className = "question-comment";
	div.setAttribute("id", "question-sent");
	var triangle = parentdiv.childNodes[1];
	triangle.childNodes[0].src = "Images/triangle-sent.png";
	var divCalis = document.createElement("div");
	divCalis.appendChild(div);
	divCalis.appendChild(triangle);
	document.getElementById("Sent-Speaker").appendChild(divCalis);
	
}

function declineQuestion(parentdiv)
{
	var abue = parentdiv.parentNode;
	//console.log(abue);
	var div = parentdiv.childNodes[0];
	console.log(div);
	var icons = div.childNodes[2];
	var newid = icons.getAttribute("id");
	
	console.log(newid);
	x.open('POST', urlServer + 'declinequestion.php', true);
	//send request
	var data = new FormData();
	data.append('idquestion', newid);

	x.send(data);
	//event handler
	x.onreadystatechange = function()
	{
		if(x.status ==200 & x.readyState == 4)
		{
			console.log(x.responseText);
		}
	}
	icons.childNodes[0].style.display = "none";
	icons.childNodes[1].childNodes[0].childNodes[0].src="Images/undo.png";
	icons.childNodes[1].setAttribute("onclick", "ReturnQuestion(this.parentNode.parentNode.parentNode);")
	icons.childNodes[2].childNodes[0].childNodes[0].src="Images/denied-.png";
	icons.childNodes[2].setAttribute("onclick",'deleteQuestion(this.parentNode.parentNode)');
	icons.childNodes[1].childNodes[1].innerHTML = localStorage.getItem('str43');
	icons.childNodes[1].childNodes[1].className = 'texto-img';
	icons.childNodes[2].childNodes[1].innerHTML= localStorage.getItem('str44');
	icons.childNodes[2].childNodes[1].className="texto-img";
	div.className = "question-comment";
	div.setAttribute("id", "question-denied");
	var triangle = parentdiv.childNodes[1];
	triangle.childNodes[0].src = "Images/triangle-denied.png";
	var divCalis = document.createElement("div");
	divCalis.appendChild(div);
	divCalis.appendChild(triangle);
	document.getElementById("Denied").appendChild(divCalis);
	if(abue.className == "comment"){
	abue.style.display = "none";
	}
	
}

function deleteQuestion(parentdiv)
{
	
	var div = parentdiv;
	var icons = div.childNodes[2];
	var newid = icons.getAttribute("id");
	
	console.log(newid);
	x.open('POST', urlServer + 'deletequestion.php', true);
	//send request
	var data = new FormData();
	data.append('idquestion', newid);

	x.send(data);
	//event handler
	x.onreadystatechange = function()
	{
		if(x.status ==200 & x.readyState == 4)
		{
			console.log(x.responseText);
			var datajson = JSON.parse(x.responseText);
			socket.emit('removeQuestion', datajson);
		}
	}
	
	console.log("empieza");
	console.log(parentdiv);
	var abuelo = parentdiv.parentNode;
	var visa = abuelo.parentNode;
	visa.removeChild(abuelo);
	
	
	
}

function editQuestion(parentdiv)
{
	var icons = parentdiv.children[2];
	console.log(icons);
	var newid = icons.getAttribute("id");
	
	console.log(newid);
	x.open('POST', urlServer + 'getask.php', true);
	//send request
	var data = new FormData();
	data.append('idquestion', newid);

	x.send(data);
	//event handler
	x.onreadystatechange = function()
	{
		if(x.status ==200 & x.readyState == 4)
		{
			var question = JSON.parse(x.responseText);
			var input = document.createElement("input");
			input.setAttribute("type", "text");
			input.className = 'input-edit';
			input.value = question.question;
			parentdiv.children[1].innerHTML = "";
			parentdiv.children[1].appendChild(input);
			input.focus();
			icons.children[0].style.display = "none";
			icons.children[1].children[0].children[0].src = "Images/delete2.png";//cambiar icono
			icons.children[1].children[1].innerHTML = localStorage.getItem('str40');
			icons.children[2].children[0].children[0].src = "Images/sign.png";//cambiar icono
			icons.children[2].children[1].innerHTML = localStorage.getItem('str45');
			icons.children[1].setAttribute("onclick", "returnTo(this.parentNode.parentNode)");
			icons.children[2].setAttribute("onclick", "changeQuestion(this.parentNode.parentNode)");
			
		}
	}
}

function returnTo(parentdiv){
	
	var icons = parentdiv.children[2];
	console.log(icons);
	var newid = icons.getAttribute("id");
	
	console.log(newid);
	x.open('POST', urlServer + 'getask.php', true);
	//send request
	var data = new FormData();
	data.append('idquestion', newid);

	x.send(data);
	//event handler
	x.onreadystatechange = function()
	{
		if(x.status ==200 & x.readyState == 4)
		{
			var input = JSON.parse(x.responseText);
			parentdiv.children[1].innerHTML = input.question;
			icons.children[0].style.display = "inline";
			icons.children[1].children[0].children[0].src = "Images/edit.png";//cambiar icono
			icons.children[1].children[1].innerHTML = localStorage.getItem('str46');
			icons.children[2].children[0].children[0].src = "Images/delete.png";//cambiar icono
			/*
			aqui arriba tengo que crear un icono
			*/
			icons.children[2].children[1].innerHTML = localStorage.getItem('str47');
			icons.children[1].setAttribute("onclick", "editQuestion(this.parentNode.parentNode);");
			icons.children[2].setAttribute("onclick", "declineQuestion(this.parentNode.parentNode.parentNode);");
			
		}
	}
}


function changeQuestion(parentdiv){
	
	var icons = parentdiv.children[2];
	
	var inp = parentdiv.children[1].children[0];
	var newid = icons.getAttribute("id");
	console.log(newid);
	
	x.open('POST', urlServer + 'editquestion.php', true);
	//send request
	var data = new FormData();
	data.append('idquestion', newid);
	data.append('txtquestion', inp.value);
	console.log(inp.value);

	x.send(data);
	//event handler
	x.onreadystatechange = function()
	{
		if(x.status ==200 & x.readyState == 4)
		{
			//console.log(x.responseText);
			parentdiv.children[1].innerHTML = inp.value;
			icons.children[0].style.display = "inline";
			icons.children[1].children[0].children[0].src = "Images/edit.png";//cambiar icono
			icons.children[1].children[1].innerHTML = localStorage.getItem('str46');
			icons.children[2].children[0].children[0].src = "Images/delete.png";//cambiar icono
			icons.children[2].children[1].innerHTML = localStorage.getItem('str47');
			icons.children[1].setAttribute("onclick", "editQuestion(this.parentNode.parentNode);");
			icons.children[2].setAttribute("onclick", "declineQuestion(this.parentNode.parentNode.parentNode);");
		}
		
	}
}

function ReturnQuestion(grantparent){
	
	
	var parentdiv = grantparent.children[0];
	var icons = parentdiv.children[2];
	
	var inp = parentdiv.children[1].children[0];
	var newid = icons.getAttribute("id");
	
	x.open('POST', urlServer + 'returnquestion.php', true);
	//send request
	var data = new FormData();
	data.append('idquestion', newid);

	x.send(data);
	//event handler
	x.onreadystatechange = function()
	{
		if(x.status ==200 & x.readyState == 4)
		{
			//console.log(x.responseText);
			icons.children[0].style.display = "inline";
			icons.children[1].children[0].children[0].src = "Images/edit.png";//cambiar icono
			icons.children[1].children[1].innerHTML = localStorage.getItem('str46');
			icons.children[1].children[1].className = "text-img";
			icons.children[2].children[0].children[0].src = "Images/delete.png";//cambiar icono
			icons.children[2].children[1].innerHTML = localStorage.getItem('str47');
			icons.children[2].children[1].className = "text-img";
			icons.children[1].setAttribute("onclick", "editQuestion(this.parentNode.parentNode);");
			icons.children[2].setAttribute("onclick", "declineQuestion(this.parentNode.parentNode.parentNode);");
			parentdiv.setAttribute("id","question-hold");
			var triangle = grantparent.children[1].children[0];
			triangle.src = "Images/triangle-onhold.png";
			document.getElementById("onhold").appendChild(grantparent);
			console.log(grantparent);
		}
		
	}
}

function showAll()
{
	idconf = localStorage.getItem("id");
	console.log('getconference.php?id='+idconf);
	x.open('GET', urlServer + 'getconference.php?id='+idconf, true);
	//send request

	x.send();
	//event handler
	
	x.onreadystatechange = function()
	{
		if(x.status ==200 & x.readyState == 4)
		{
			data = JSON.parse(x.responseText);
			document.getElementById("confT").innerHTML = data.title;
			document.getElementById("name-speaker").innerHTML = data.speaker.name + " " + data.speaker.lastname;
			document.getElementById("placeC").innerHTML = "<h3>" + localStorage.getItem('str30') +"</h3><br>"+data.Place+","+data.Room;
			document.getElementById("date").innerHTML = data.date;
			document.getElementById("time").innerHTML = data.time;
			console.log(data);
			showAl();
			/*showAllAcept();
			showAllDecline();*/
		}
	}
	
}

function showAl()
{
	var idconf = localStorage.getItem("id");
	x.open('POST', urlServer + 'getasks.php', true);
	//send request
	var data = new FormData();
	data.append('txtidconference', idconf);
	data.append('mode', '1');
	
	var divOnHold = document.getElementById('onhold');
	divOnHold.innerHTML = '';

	x.send(data);
	//event handler
	x.onreadystatechange = function()
	{
		if(x.status ==200 & x.readyState == 4)
		{
			data = (x.responseText);
			data = data.replace("\\n","");
			console.log(data);
			jsondata = JSON.parse(data);
			asks = jsondata.asks;
			console.log(asks);
			for(var i = 0; i < asks.length; i++)
			{
				console.log("registro todas "+i);
				showAllMessages(asks[i]);
				gowait();
				//showAllAcept();
			}
		}
	}
}

function showAllAcept()
{
	var idconf = localStorage.getItem("id");
	x.open('POST', urlServer + 'getasks.php', true);
	//send request
	var data = new FormData();
	data.append('txtidconference', idconf);
	data.append('mode', '2');
	
	var divSent = document.getElementById('Sent-Speaker');
	divSent.innerHTML ='';

	x.send(data);
	//event handler
	x.onreadystatechange = function()
	{
		if(x.status ==200 & x.readyState == 4)
		{
			data = (x.responseText);
			data = data.replace("\\n","");
			console.log(data);
			jsondata = JSON.parse(data);
			asks = jsondata.asks;
			console.log(asks);
			
			for(var i = 0; i < asks.length; i++)
			{
				console.log("registro acept "+i);
				showSentMessages(asks[i]);
				goacept();
				//showAllDecline();
			}
		}//if
	}//function
	
}

function showAllDecline()
{
	var idconf = localStorage.getItem("id");
	x.open('POST', urlServer + 'getasks.php', true);
	//send request
	var data = new FormData();
	data.append('txtidconference', idconf);
	data.append('mode', '3');
	
	var divDenied = document.getElementById('Denied');
	divDenied.innerHTML = '';

	x.send(data);
	//event handler
	x.onreadystatechange = function()
	{
		if(x.status ==200 & x.readyState == 4)
		{
			data = (x.responseText);
			data = data.replace("\\n","");
			console.log(data);
			jsondata = JSON.parse(data);
			asks = jsondata.asks;
			console.log(asks);

			for(var i = 0; i < asks.length; i++)
			{
				console.log("registro decline "+i);
				showDeclineMessages(asks[i]);
				godecline();
			}
			
		}
	}
}


function godecline()
{
	/**No Mover******************************/
	//get to divs 
	var divOnHold = document.getElementById('onhold');
	var divSent = document.getElementById('Sent-Speaker');
	var divDenied = document.getElementById('Denied');
	var divTrivia = document.getElementById('Trivia');

	
	//get to tabs
	var tabOnHold = document.getElementById('first');
	var tabSent = document.getElementById('second');
	var tabDenied = document.getElementById('last');
	var tabTrivia = document.getElementById('fourth');
	
	//hide others div
	divOnHold.style = 'display:none';
	divDenied.style = 'display:inline';
	divSent.style = 'display:none';
	divTrivia.style='display:none;';
	
	//select tabD
	tabOnHold.style = 'background:#D8D8D8';
	tabDenied.style = 'background:#FFF';
	tabSent.style = 'background:#D8D8D8';
	tabTrivia.style = 'background:#D8D8D8';
	
	/**************************************/
	
	//showAllDecline();

}

function gowait()
{
	
	/**No Mover******************************/
	//get to divs 
	var divOnHold = document.getElementById('onhold');
	//divOnHold.innerHTML = '';
	
	var divSent = document.getElementById('Sent-Speaker');
	var divDenied = document.getElementById('Denied');
	var divTrivia = document.getElementById('Trivia');
	
	//get to tabs
	var tabOnHold = document.getElementById('first');
	var tabSent = document.getElementById('second');
	var tabDenied = document.getElementById('last');
	var tabTrivia = document.getElementById('fourth');
	
	
	//hide others div
	divOnHold.style = 'display:inline';
	divDenied.style = 'display:none';
	divSent.style = 'display:none';
	divTrivia.style='display:none;';
	
	//select tab
	tabOnHold.style = 'background:#FFF';
	tabDenied.style = 'background:#D8D8D8';
	tabSent.style = 'background:#D8D8D8';
	tabTrivia.style = 'background:#D8D8D8';
}

function goacept(){
	/**No Mover******************************/
	//get to divs 
	var divOnHold = document.getElementById('onhold');
	var divSent = document.getElementById('Sent-Speaker');
	var divDenied = document.getElementById('Denied');
	var divTrivia = document.getElementById('Trivia');
	
	//get to tabs
	var tabOnHold = document.getElementById('first');
	var tabSent = document.getElementById('second');
	var tabDenied = document.getElementById('last');
	var tabTrivia = document.getElementById('fourth');
	
	
	//hide others div
	divOnHold.style = 'display:none';
	divDenied.style = 'display:none';
	divSent.style = 'display:inline';
	divTrivia.style='display:none;';
	
	//select tabD
	tabOnHold.style = 'background:#D8D8D8';
	tabDenied.style = 'background:#D8D8D8';
	tabSent.style = 'background:#FFF';
	tabTrivia.style = 'background:#D8D8D8';
	/**************************************/
	
}

function lauch()
{
showAll();
showAllAcept();
showAllDecline();
}

/***************TRIVIA QUESTIONS**************/

/****All the trivia messages**/
function showTriviaMessages(data)
{
	
	/**No Mover******************************/
	//get to divs 
	var divTrivia= document.getElementById('Trivia');
	
	var divOnHold = document.getElementById('onhold')
	var divSent = document.getElementById('Sent-Speaker');
	var divDenied = document.getElementById('Denied');
	
	//get to tabs
	var tabOnHold = document.getElementById('first');
	var tabSent = document.getElementById('second');
	var tabDenied = document.getElementById('last');
	var tabTrivia = document.getElementById('fourth');

	
	//create container 
	var divComment = document.createElement('div');
	divComment.className = 'comment';
	divComment.style.transform = 'scale(0.1)';
	divComment.style.opacity = '0';
	
	
	//Create inside container
	var divQuestion = document.createElement('div');
	divQuestion.setAttribute('id', 'question-trivia');
	divQuestion.className = 'question-comment';
	
	
	//create details container
	var divDetails = document.createElement('div');
	divDetails.className = 'details';
	
	//create name div
	var divPerson = document.createElement('div');
	divPerson.className = 'question-person';
	divPerson.innerHTML = localStorage.getItem('str49') + ' ' + data.user;
	
	//create date div
	var divDate = document.createElement('div');
	divDate.className = 'question-date'; 
	divDate.innerHTML = data.date; //Editar aquí
	
	//create text container
	var divText = document.createElement('div');
	divText.innerHTML = data.question; //Editar aquí
	divText.className = 'question-text';
	divText.setAttribute("id","edit-text");
	
	//create div send
	var divImg = document.createElement('div');
	divImg.className = 'icon-tick';

	//create icon send
	var iconTick = document.createElement('img');
	iconTick.src = 'Images/tick-ok.png';
	
	divImg.appendChild(iconTick);
	
	var divTrueOption = document.createElement('div');
	divTrueOption.className = 'question-anwers';
	divTrueOption.innerHTML =localStorage.getItem('str50')+ ' ' + data.answeroptions[0].answer; 
	
	//create div send
	var divImg1 = document.createElement('div');
	divImg1.className = 'icon-tick';

	//create icon send
	var iconTick1 = document.createElement('img');
	iconTick1.src = 'Images/tick-ko.png';
	
	divImg1.appendChild(iconTick1);
	
	var divOption1= document.createElement('div');
	divOption1.className = 'question-anwers';
	divOption1.innerHTML = localStorage.getItem('str51') + ' ' + data.answeroptions[1].answer; 
	
	//create div send
	var divImg2 = document.createElement('div');
	divImg2.className = 'icon-tick';

	//create icon send
	var iconTick2 = document.createElement('img');
	iconTick2.src = 'Images/tick-ko.png';
	
	divImg1.appendChild(iconTick2);
	
	var divOption2= document.createElement('div');
	divOption2.className = 'question-anwers';
	divOption2.innerHTML = localStorage.getItem('str51') + ' ' + data.answeroptions[2].answer; 
	
	
	//create icons container
	var divIconContainer = document.createElement('div');
	divIconContainer.setAttribute('id', data.id);
	divIconContainer.className = 'question-icons';
	
	//create div send
	var divSendIcon = document.createElement('div');
	divSendIcon.setAttribute('id', data.id);
	divSendIcon.className = 'icon';
	divSendIcon.setAttribute("onclick", "sentToTrivia(this.parentNode, 1)");
	
	//create img container
	var divImgSend = document.createElement('div');
	
	//create icon send
	var iconSend = document.createElement('img');
	iconSend.src = 'Images/send-trivia.png';	
	
	//create text icon
	var textSend = document.createElement('div');
	textSend.innerHTML = localStorage.getItem('str39');	
	textSend.className = 'texto-trivia';	
	
		
	//create triangle
	var divTriangle = document.createElement('div');
	divTriangle.className = 'question-triangle';
	divTriangle.setAttribute("id",'triangle');
	
	//triangle image
	var imgTriangle = document.createElement('img');
	imgTriangle.src = 'Images/triangle-trivia.png';
	
	//Add name person and date to details div
	divDetails.appendChild(divDate);
	divDetails.appendChild(divPerson);	
	
	//Add details to question-onhold div
	divQuestion.appendChild(divDetails);
	
	//Add question text to comment div
	divQuestion.appendChild(divText);
	
	divQuestion.appendChild(divImg);
	divQuestion.appendChild(divTrueOption);
	
	divQuestion.appendChild(divImg1);
	divQuestion.appendChild(divOption1);
	
	divQuestion.appendChild(divImg2);
	divQuestion.appendChild(divOption2);
	
	//Add icon send to div 
	divImgSend.appendChild(iconSend);	
	divSendIcon.appendChild(divImgSend);	
	divSendIcon.appendChild(textSend);	
	
	//Add send icon div, to container icons
	divIconContainer.appendChild(divSendIcon);
	
	//Add icon container to div question-onhold
	divQuestion.appendChild(divIconContainer);	
	
	var divCalis = document.createElement('div');
	
	
	
	//Add triangle img to triangle tab 
	divTriangle.appendChild(imgTriangle);
	
	divCalis.appendChild(divQuestion);
	divCalis.appendChild(divTriangle);
	
	//Add triangle tab to div comment
	divComment.appendChild(divCalis);
	
	
	
	//Add div comment to father div on-hold
	divTrivia.appendChild(divComment);
	
	var t1 = new TimelineLite();
			
			t1.to(divComment, 0.5, {opacity: 1, scale: 1, ease: Quart.easeOut});
}


function showTriviaQuestions()
{
	var idconf = localStorage.getItem("id");
	x.open('POST', urlServer + 'getquestionsbyconference.php', true);
	
	//send request
	var data = new FormData();
	data.append('txtidconference', idconf);
	data.append('mode', '4');
	
	var divTrivia = document.getElementById('Trivia');
	divTrivia.innerHTML = '';

	x.send(data);
	//event handler
	x.onreadystatechange = function()
	{
		if(x.status ==200 & x.readyState == 4)
		{
			data = (x.responseText);
			data = data.replace("\\n","");
			//console.log(data);
			var jsondata = JSON.parse(data);
			asks = jsondata.questions;
			console.log(asks);
			for(var i = 0; i < asks.length; i++)
			{
				console.log("registro todas "+i);
				showTriviaMessages(asks[i]);
				goTrivia();
				//showAllAcept();
			}
		}
	}
}

function goTrivia()
{
	/**No Mover******************************/
	//get to divs 
	var divOnHold = document.getElementById('onhold');
	var divSent = document.getElementById('Sent-Speaker');
	var divDenied = document.getElementById('Denied');
	var divTrivia = document.getElementById('Trivia');

	
	//get to tabs
	var tabOnHold = document.getElementById('first');
	var tabSent = document.getElementById('second');
	var tabDenied = document.getElementById('last');
	var tabTrivia = document.getElementById('fourth');
	
	//hide others div
	divOnHold.style = 'display:none';
	divDenied.style = 'display:none';
	divSent.style = 'display:none';
	divTrivia.style='display:inline;'
	
	//select tabD
	tabOnHold.style = 'background:#D8D8D8';
	tabDenied.style = 'background:#D8D8D8';
	tabSent.style = 'background:#D8D8D8';
	tabTrivia.style = 'background:#FFF';
	/**************************************/
}
function sentToTrivia(parentdiv, mode)
{
	console.log(parentdiv);
	console.log(mode);
	
	x.open('POST', urlServer + 'playquestion.php', true);
	var data = new FormData();
	
	if (mode == 1)
	{
		var father = parentdiv.parentNode.parentNode.parentNode;
		console.log(father);
		var icons = parentdiv.childNodes[0];
		console.log(icons);
		var id = icons.getAttribute("id");	
		console.log(id);
		
		data.append('idquestion', id);
		x.send(data);
		//event handler
		x.onreadystatechange = function()
		{
			if(x.status ==200 & x.readyState == 4)
			{
				console.log(x.responseText);
				
				
				data = JSON.parse(x.responseText);
				console.log(data);
				
				socket.emit('sendQuestion', data);//aqui
				
				/*questionTrivia(data);*/
				removeQuestionTrivia(father);
			}
		}
		
	}
	if(mode ==2)
	{
		var father = parentdiv;
		var button = father.childNodes[1];
		var id = button.getAttribute("id");
		
		console.log(id);
		data.append('idquestion', id);

		x.send(data);
		//event handler
		x.onreadystatechange = function()
		{
			if(x.status ==200 & x.readyState == 4)
			{
				console.log(x.responseText);
				data = JSON.parse(x.responseText);
				console.log(data);

				socket.emit('sendQuestion', data);

				clean();
				getQuestions();
				//NO REPETIR EL BOTÓN DE ANADIR PREGUNTA    
				var btnAdd = document.getElementById('create-question');
				var cont = document.getElementById('cont');            
				cont.removeChild(btnAdd);
			}

		}
	//send request	
	
	
	}
}

function removeQuestionTrivia (father)
{
	var content = document.getElementById('Trivia');
	content.removeChild(father);
}


/*SOCKETS*/
function deletemessage(div)
{
	div.parentNode.style.display = "none";
}

function showNotificationNewQuestion(data)
{
	
	try{
				localStorage.setItem("dataQuestion", JSON.stringify(data));
				console.log(JSON.stringify(data));
				}
				catch(err){
					console.log("error guardando el data");
				}
	
	
	console.log(data)
	
	//animacion
		var t1 = new TimelineLite();
		var t2 = new TimelineLite();
		
	try
	{
		var divGnrlNot = document.getElementById('notification');
		//divGnrlNot.setAttribute("onClick", "questionTrivia(null);");
		
		//
		// testeando eliminacion de modal
		var divClose  = document.getElementById('closeModal');
		console.log(divClose);
		divClose.setAttribute("onClick", "deletemessage(this);");
		
		var divAccept = document.getElementById('seeAndClose');
		divAccept.setAttribute("onClick",'questionTrivia(null);deletemessage(this);');
		
		
		
		//
		
		t2.to(divGnrlNot, 0, {bottom: '-90px'});
		divGnrlNot.style.display = "inline";
		t2.to(divGnrlNot, 1, {bottom: '50px', ease:Elastic.easeOut});
	}catch(err){}
		
	try
	{
		var divNotification = document.getElementById('notificationGlobe');
		console.log(divNotification);
		divNotification.innerHTML = Number(divNotification.innerHTML) + 1;
				
		t1.to(divNotification, 0, {scale: 0});
		
		divNotification.style.display = 'inline';
	
		t1.to(divNotification, 0.5, {scale: 1, ease:Elastic.easeOut});
		
		
	}catch(err){}
		

	
	
	
	
}				//socket.emit('sendQuestion', data);//aqui

function logout()
{
	localStorage.clear();
	sessionStorage.clear();
	window.location="index.html";
}

function showEvents()
{

    $.ajax({
              url: urlServer + "getallevents.php",
              type: "POST"
    }).done(function(data){
        var jsonResult = JSON.parse(data);
        var events = "";
        $.each(jsonResult.events, function(i, item){
             var event = '<div class="content-info-conference" onclick="saveIdEvent('+ item.id +')" data-id="'+ item.id +'"><table class="table-conference" cellspacing="0" cellpadding="0"><tr><td class="td-speaker" colspan="2"><div id="content-speaker"><img src="../web/upload/' + item.logo + '"><div id="name-speaker" style="color: white; font-size: 20px;">' + item.name + '</div></div></td></tr></table></div>';
             $("#subject-content").append($.parseHTML(event));
        });
        
       
        
    });
    

}

function saveIdEvent(id)
{
    var type = localStorage.getItem("type");
    localStorage.setItem("idevent", id);
    var location = "";
    
    if(type === '2') location = "conferences-speaker.html";
    if(type === '3') location = "conferences-moderator.html";
    if(type === '4') location = "conferences.html";
    
    window.location = location;
}