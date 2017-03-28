/*******SERVER************/
//variables
var urlServer = 'https://croissant-santy-ruler.c9users.io/croissant/';//modificar una vez se cambie de nombre a la carpeta
var x = new XMLHttpRequest();
var socket = io.connect();

function init(){
        infoConference();
    }
    
 window.onload = init;


/**LocalStorage**/
var conferenceId = localStorage.getItem('id');
var userId = localStorage.getItem('userId');
var time = localStorage.getItem('time');

var totalTime = 15-time;

/*Añadir score a la API*/
function getScore(questionId, answerId)
{
	window.location = 'scores.html';
    localStorage.removeItem("dataQuestion");
    localStorage.removeItem("date");
    
    
    x.open('POST', urlServer + 'addscoreuser.php', true);
	var data = new FormData();
	data.append('txtquestion', questionId);
	data.append('txtiduser', userId);
	data.append('txtanswer', answerId);
	data.append('txttime', totalTime);
	
	x.send(data);
	//event handler
	x.onreadystatechange = function()
	{
		if(x.status ==200 & x.readyState == 4)
		{
			console.log(x.responseText);
			var JSONdata = JSON.parse(x.responseText);
		}
	}
}

/*Información conferencia*/
function infoConference()
{
	console.log('getconference.php?id='+conferenceId);
	x.open('GET', urlServer + 'getconference.php?id='+conferenceId, true);
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
			postScores();
		}
	}
	
}

/*Parsear API getscoresbyconference*/
/*Se obtienen preguntas de trivia por conferencia*/
function postScores()
{
	console.log('conferenceId ' + conferenceId);
	var questionId = localStorage.getItem('question');
	console.log('qId ' + questionId);
    
    x.open('POST', urlServer + 'getscoresbyconference.php', true);
	var data = new FormData();
	data.append('idconference', conferenceId);
	data.append('idquestion', questionId);
	
	x.send(data);
	//event handler
	x.onreadystatechange = function()
	{
		if(x.status ==200 & x.readyState == 4)
		{
			
			console.log(x.responseText);
			var JSONdata = JSON.parse(x.responseText);
			var data =  JSONdata;
			showChart(data);
			showChartDetails(data);
			getQuestionInfo(data);
			console.log(data);
		}
	}
	
}



//Gráficas
function showChart(data)
{
	//svg element
	var svg = document.getElementById('svg');
	drawLine(svg, 'yaxis', '1%', '0px', '1%', '170px', 'line');
	
	var lineY = 170;
	var barY = 10;
	var barHeight = lineY/3;
	var width = 100 / data.countQuestions;
	
	console.log('countQuestions '+data.countQuestions);
	
	for(var i=0; i<3; i++)
	{
		//BAR			
		var barWidth =  width;
		drawRect(svg, 'bar'+(i+1), '1%', barY + 'px', barWidth + '%', (barHeight/2)+10, 'graph');
		

		//VALUE
		var xBar = ((barWidth/2)+1);
		writeText(svg, 'value'+(i+1), xBar+'%', (barY + (barHeight/2)), data.scores[i].points, 'middle', 'value');		
		barY += barHeight;
	}
	chartValues(data, width);
}

function chartValues(data, width)
{
	//Read grades
	for (var i=0; i<3; i++)
	{
		//bar
		var bar = document.getElementById('bar' + (i+1));
		var barWidth = data.scores[i].points * width;
		bar.setAttribute('width', barWidth + '%');
		
		//value
		var value= document.getElementById('value' + (i+1));
		value.innerHTML = data.scores[i].points;
		value.setAttribute('x', ((barWidth/2)+1)+'%');
	}
}

//Este método muestra a los 3 primeros lugares
function showChartDetails(data)
{

	var lineY = 170;
	var barHeight = lineY/3;
	var ySize = 35;
	
	//svg element
	var chart = document.getElementById('chart');
	var images = document.getElementById('images');
	
	var imgFirst = document.createElement('img');
	imgFirst.src = 'Images/first.png';
	imgFirst.className = 'imgSvg';
	
	images.appendChild(imgFirst);
	
	var imgSecond = document.createElement('img');
	imgSecond.src = 'Images/second.png';
	imgSecond.className = 'imgSvg';
	
	images.appendChild(imgSecond);
	
	var imgThird = document.createElement('img');
	imgThird.src = 'Images/third.png';
	imgThird.className = 'imgSvg';
	
	images.appendChild(imgThird);
	
	
	
	for(var i=0; i<3; i++)
	{
		writeText(chart, '', '100%', ySize+'px',data.scores[i].user.name, 'end', 'title');		
		ySize += barHeight;
	}
	
}

//Este método muestra la pregunta quienes contestaron bien, la respuesta y quienes contestaron mal
function getQuestionInfo(data)
{
	var container = document.getElementById('container');
	
	var divQuestion = document.createElement('div');
	divQuestion.innerHTML = data.ask.question;
	divQuestion.className='question';
	
	var divAnswer = document.createElement('div');
	divAnswer.innerHTML = localStorage.getItem('str72') + ' ' + data.ask.answerOptions[0].answer;
	divAnswer.className = 'answer';
	
	container.appendChild(divQuestion);
	container.appendChild(divAnswer);
	
	
	var stats = document.getElementById('stats');
	
	var divText = document.createElement('div');
	divText.innerHTML = localStorage.getItem('str73');
	divText.className ='head';
	
	var wrong = document.createElement('div');
	wrong.innerHTML = data.ask.totalWrongPersons;
	wrong.className ='wrong';
	
	var correct = document.createElement('div');
	correct.innerHTML = data.ask.totalCorrectPersons;
	correct.className = 'correct';
	
	var textWrong = document.createElement('div');
	textWrong.innerHTML = localStorage.getItem('str71');
	textWrong.className = 'wrongx';
	
	var textCorrect = document.createElement('div');
	textCorrect.innerHTML = localStorage.getItem('str70');
	textCorrect.className='correctx';
	
	correct.appendChild(textCorrect);
	wrong.appendChild(textWrong);
	
	stats.appendChild(divText);
	stats.appendChild(correct);
	stats.appendChild(wrong);
}