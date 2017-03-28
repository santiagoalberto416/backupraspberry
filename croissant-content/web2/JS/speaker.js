function showAllInformation()
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
			showAllSpeakerQuestion()
		}
	}
	
}

function showSpeakerMessages(data)
{
	/**No Mover******************************/
	//get to divs 
	var divSent = document.getElementById('zone-speaker');
	
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
	divPerson.innerHTML = data.user + ' ' + localStorage.getItem('str31')+': '; //Editar aquí
	else
	{
		divPerson.innerHTML = "User" + ' ' + localStorage.getItem('str31')+': '; 
	}
	
	//create date div
	var divDate = document.createElement('div');
	divDate.className = 'question-date'; 
	divDate.innerHTML = data.date; //Editar aquí
	
	//create text container
	var divText = document.createElement('div');
	divText.innerHTML = data.question; //Editar aquí
	divText.className = 'question-text';
	
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


function showAllSpeakerQuestion()
{
	var idconf = localStorage.getItem("id");
	x.open('POST', urlServer + 'getasks.php', true);
	//send request
	var data = new FormData();
	data.append('txtidconference', idconf);
	data.append('mode', '2');
	
	var divMessage = document.getElementById('message');
	var divCont = document.getElementById('subject-content');

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
			
			if (asks.length ==0)
			{

				divMessage.innerHTML = localStorage.getItem('str33');
			}
			else 
			{
				for(var i = 0; i < asks.length; i++)
				{
					console.log("registro acept "+i);
					divMessage.innerHTML = '';
					divMessage.className='m';
					showSpeakerMessages(asks[i]);
				}
			}
		}//if
	}//function
	
}

