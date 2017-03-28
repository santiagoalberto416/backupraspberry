// en see more trigo todas las preguntas de esa conferencia

//variables
var urlServer = 'https://croissant-santy-ruler.c9users.io/croissant/';//modificar una vez se cambie de nombre a la carpeta
//var urlImages 
var x = new XMLHttpRequest();
var socket = io.connect();
// Optional: If you're using the UI pack, require it after Velocity. (You don't need to assign it to a variable.


/********************TRIVIA MODERATOR**********************/

/**
* En esta funcion, se mostrara los detalles de las preguntas, cuando se de click en see more
*/
var hide = true;

function hideInfo(idmore, index)
{
	console.log(index);

    var idhide = idmore;
    idhide = idhide.replace('more', 'hide')
    
    var hideDiv = document.getElementById(idhide);
    var btnHide = document.getElementById(idmore);
    btnHide.className = 'more';
	
	var divQuestion = document.getElementById('question-body'+index);
	
        if (hide)
        {
			
            hideDiv.style = "display:none;"; 
			divQuestion.style = 'display:inline;';
            btnHide.style = "background:#2D7069";
            btnHide.innerHTML = localStorage.getItem('str55');
            hide=false;
        }
        else 
        {

            hideDiv.style = "display:inline;"; 
			divQuestion.style = 'display:none;';
            btnHide.innerHTML = localStorage.getItem('str56');
            btnHide.style = "background:#D15F2A;"
            hide = true;
        }
    
}
/*Método que borra todas las respuestas, con el id de la pregunta*/
function deleteAnswersTrivia(id)
{
	console.log(id)
    //var option1 = document.getElementById('option1').value;
    x.open('POST', urlServer + 'deleteanswertrivia.php', true);
	var data = new FormData();
	data.append('id', id);
    x.send(data);
	//event handler
	x.onreadystatechange = function()
	{
		if(x.status ==200 & x.readyState == 4)
		{
			console.log(x.responseText);
			var JSONdata = JSON.parse(x.responseText);
            deleteQuestionTrivia(id);	
            
		}
	}
    
}
/*Este método borra la pregunta con su respectivo id*/
function deleteQuestionTrivia(id)
{
	console.log(id);
    //var option1 = document.getElementById('option1').value;	
    x.open('POST', urlServer + 'deletequestiontrivia.php', true);
	var data = new FormData();
	data.append('txtid', id);
    x.send(data);
	//event handler
	x.onreadystatechange = function()
	{
		if(x.status ==200 & x.readyState == 4)
		{
			console.log(x.responseText);
			var JSONdata = JSON.parse(x.responseText);
			
			clean();
            getQuestions();
			//NO REPETIR EL BOTÓN DE ANADIR PREGUNTA    
            var btnAdd = document.getElementById('create-question');
			var cont = document.getElementById('cont');            
			cont.removeChild(btnAdd);  
		}
	}
    
}

/*este método cambia a inputs text, todos los campos, y se trae los datos de la API*/
function updateAnswers(parent, id)
{
	var parentQuestion = parent.children[3];
	//console.log(parent);
	//console.log(id);
	var icons = parent.children[3].children[9];
	icons.setAttribute('id', id);
	//console.log(icons);
	x.open('POST', urlServer + 'getquestionanswer.php', true);
	
	//send request
	var data = new FormData();
	data.append('id', id);
	x.send(data);	
	
	x.onreadystatechange = function()
	{
		if(x.status ==200 & x.readyState == 4)
		{
			//console.log(x.responseText);
			var questionData = JSON.parse(x.responseText);			
			
			
			var txtArea = document.createElement('textarea');
			txtArea.className='txt-areaedit';
			txtArea.value = questionData.question;
			txtArea.setAttribute('onkeypress', 'return (event.keyCode !=13);');
			parentQuestion.children[0].innerHTML = '';
			parentQuestion.children[0].appendChild(txtArea);
			txtArea.focus();
			
			
			var inputDate= document.createElement('input');
			inputDate.setAttribute('type', 'text');
			inputDate.className = 'txt-edit';
			inputDate.value = questionData.date;
			parentQuestion.children[2].innerHTML = '';
			parentQuestion.children[2].appendChild(inputDate);
			
			
			var inputTrueOption = document.createElement('input');
			inputTrueOption.className = 'txt-edit';
			inputTrueOption.setAttribute('type', 'text');			
			inputTrueOption.value = questionData.answerOptions[0].answer;
			inputTrueOption.setAttribute('id', questionData.answerOptions[0].idAnswer);			
			parentQuestion.children[4].innerHTML = '';
			parentQuestion.children[4].appendChild(inputTrueOption);
			
			
			var inputOption2 = document.createElement('input');
			inputOption2.className = 'txt-edit';
			inputOption2.setAttribute('type', 'text');
			inputOption2.value = questionData.answerOptions[1].answer;
			inputOption2.setAttribute('id', questionData.answerOptions[1].idAnswer);
			parentQuestion.children[6].innerHTML = '';
			parentQuestion.children[6].appendChild(inputOption2);
			
			var inputOption3 = document.createElement('input');
			inputOption3.className = 'txt-edit';
			inputOption3.setAttribute('type', 'text');
			inputOption3.value = questionData.answerOptions[2].answer;
			inputOption3.setAttribute('id', questionData.answerOptions[2].idAnswer);
			parentQuestion.children[8].innerHTML = '';
			parentQuestion.children[8].appendChild(inputOption3);
			
			
			icons.children[0].innerHTML = localStorage.getItem('str39');
			icons.children[0].setAttribute('onclick', 'saveChanges(this.parentNode.parentNode, '+id+');');
			icons.children[1].innerHTML = localStorage.getItem('str40');
			icons.children[1].setAttribute('onclick', 'getQuestionReturn(this.parentNode.parentNode.parentNode, '+id+');')			
		}
	}
}

/*Este método guarda los cambios*/
function saveChanges(parent, id)
{

	var txtArea = parent.children[0].children[0].value;
	//console.log(txtArea);
	var txtDate = parent.children[2].children[0].value;
	//console.log(txtDate);
	
	console.log(parent);
	console.log(id);
	var icons = parent.children[9];
	icons.setAttribute('id', id);
	//console.log(icons);
	x.open('POST', urlServer + 'updatetrivia.php', true);
	
	//send request
	var data = new FormData();
	data.append('id', id);
	data.append('question', txtArea);
	data.append('date', txtDate);
	x.send(data);	
	
	//event handler
	x.onreadystatechange = function()
	{
		if(x.status ==200 & x.readyState == 4)
		{
			//console.log(x.responseText);
			parent.children[0].innerHTML = txtArea;
			parent.children[2].innerHTML = txtDate;
			
			editOptionTrue(parent);
			
			icons.children[0].innerHTML = localStorage.getItem('str46');
			icons.children[0].setAttribute('onclick', 'updateAnswers(this.parentNode.parentNode.parentNode,'+id+');');
			icons.children[1].innerHTML = localStorage.getItem('str44');
			icons.children[1].setAttribute('onclick', 'showModal(400, 200, "'+localStorage.getItem('str57')+'",'+id+');');	
		}
		
	}
}
/*Este método edita solo la opción que es verdadera*/
function editOptionTrue(parent)
{
	//console.log(parent);
	var txtTrue = parent.children[4].children[0];
	console.log(txtTrue);
	var id = txtTrue.getAttribute("id");
	console.log(id);

	x.open('POST', urlServer + 'updateanswertrivia.php', true);
	//send request
	var data = new FormData();
	data.append('id', id);
	data.append('answer', txtTrue.value);
	console.log(txtTrue.value);
	x.send(data);
	
	//event handler
	x.onreadystatechange = function()
	{
		if(x.status== 200 & x.readyState==4)
		{
			parent.children[4].innerHTML = txtTrue.value;
			editOptionOne(parent);
		}
	}
	
}
/*Este método edita solo la segunda opción */
function editOptionOne(parent)
{
	var txtTrue = parent.children[6].children[0];
	var id = txtTrue.getAttribute("id");

	x.open('POST', urlServer + 'updateanswertrivia.php', true);
	//send request
	var data = new FormData();
	data.append('id', id);
	data.append('answer', txtTrue.value);
	x.send(data);
	
	//event handler
	x.onreadystatechange = function()
	{
		if(x.status== 200 & x.readyState==4)
		{
			parent.children[6].innerHTML = txtTrue.value;
			editOptionTwo(parent);
		}
	}
	
}
/*Este método edita solo la tercera opción */
function editOptionTwo(parent)
{
	var txtTrue = parent.children[8].children[0];
	var id = txtTrue.getAttribute("id");

	x.open('POST', urlServer + 'updateanswertrivia.php', true);
	//send request
	var data = new FormData();
	data.append('id', id);
	data.append('answer', txtTrue.value);
	x.send(data);
	
	//event handler
	x.onreadystatechange = function()
	{
		if(x.status== 200 & x.readyState==4)
		{
			parent.children[8].innerHTML = txtTrue.value;
		}
	}
	
}
/*función que regresa la pregunta a su estado original, cuando se presiona el botón cancel*/
function getQuestionReturn(parent, id)
{
	var parentQuestion = parent.children[3];
	console.log(parent);
	console.log(id);
	var icons = parent.children[3].children[9];
	icons.setAttribute('id', id);
	console.log(icons);
	x.open('POST', urlServer + 'getquestionanswer.php', true);
	//send request
	var data = new FormData();
	data.append('id', id);
	x.send(data);	
	
	x.onreadystatechange = function()
	{
		if(x.status ==200 & x.readyState == 4)
		{
			console.log(x.responseText);
			var questionData = JSON.parse(x.responseText);
			parentQuestion.children[0].innerHTML = questionData.question;
			parentQuestion.children[2].innerHTML = questionData.date;
			parentQuestion.children[4].innerHTML = questionData.answerOptions[0].answer;
			parentQuestion.children[6].innerHTML = questionData.answerOptions[1].answer;
			parentQuestion.children[8].innerHTML = questionData.answerOptions[2].answer;
			
	
			icons.children[0].innerHTML = localStorage.getItem('str46');
			icons.children[0].setAttribute('onclick', 'updateAnswers(this.parentNode.parentNode.parentNode,'+id+');');
			icons.children[1].innerHTML = localStorage.getItem('str44');
			icons.children[1].setAttribute('onclick', 'showModal(400, 200, "Delete Question",'+id+');');		
		}
	}
}

/**
*Esta funcion carga las preguntas de la trivia hechas previamente
*/
/**Modificado por Dalia Pinto 18/03**/
function addButton()
{
    var divCont = document.getElementById('cont');
    
    var divCreate = document.createElement('div');
    divCreate.setAttribute('id', 'create-question');
    
    var divButton = document.createElement('div');
    divButton.className = 'buttons';
    
    var btnAdd = document.createElement('button');
    btnAdd.className='add-new';
    btnAdd.setAttribute('onclick', 'addFormQuestion();');
    btnAdd.innerHTML=localStorage.getItem('str58');
    btnAdd.setAttribute('id', 'btn-add-question');    
	btnAdd.disabled= false;
	btnAdd.style.display='inline';
    
    
    
    divButton.appendChild(btnAdd);
    divCreate.appendChild(divButton);  
    divCont.appendChild(divCreate);
}

/**Modificado por Dalia Pinto 18/03**/
var largearray;
function getQuestions()
{
    var idconf = localStorage.getItem('id');
    x.open('POST', urlServer + 'getquestionsbyconference.php', true);
	//send request
	var data = new FormData();
	data.append('txtidconference', idconf);
	data.append('mode', 4);

	x.send(data);
    x.onreadystatechange = function()
	{
		if(x.status ==200 & x.readyState == 4)
		{
			
			var JSONdata = JSON.parse(x.responseText);
            console.log(JSONdata.questions.length);
            localStorage.setItem('largearray', JSONdata.questions.length);
            
            if(JSONdata.questions.length==0)
            {
                var divCont = document.getElementById('cont');

                var divMessage = document.createElement('div');
                divMessage.setAttribute('id', 'message');
                divMessage.innerHTML= localStorage.getItem('str59');
                divCont.appendChild(divMessage);
            }
            else
            {
                for(var i = 0; i < JSONdata.questions.length; i++)
                {
                    //Div Padre
                    var divCont = document.getElementById('cont');   
                    var divMessage = document.createElement('div');
                    divMessage.setAttribute('id', 'message');
                    divMessage.innerHTML='';
                    divCont.appendChild(divMessage);

                    //Se crea un nuevo div contenedor de las preguntas
                    var divQuestion = document.createElement('div');
					divQuestion.className = 'questions';
                    divQuestion.setAttribute('id', 'questions');

                    //Encabezado de la Question
                    var divHead = document.createElement('div');
                    divHead.className = 'text-headerquestion';
                    divHead.innerHTML= localStorage.getItem('str60')+ ' '+(i+1)+' :'; 


                    //Se crea un botón para mostrar los detalles
                    var divMore = document.createElement('div');
                    divMore.className = 'more';
                    divMore.setAttribute('onclick', 'hideInfo(this.id, '+i+');');
                    divMore.setAttribute('id', 'more'+i);
                    divMore.innerHTML=localStorage.getItem('str55');

                    //este div contiene toda la información, para poder ocultarla
                    var divHide = document.createElement('div');
                    divHide.setAttribute('id', 'hide'+i);
                    divHide.style ='display:none;';
					
					var divSend = document.createElement('div');
                    divSend.setAttribute('id', JSONdata.questions[i].id);
					divSend.className = 'sent';
					divSend.innerHTML = localStorage.getItem('str65');
					divSend.setAttribute('onclick', 'sentToTrivia(this.parentNode, 2)');

                    //Texto de la pregunta
                    var divTextQuestion = document.createElement('div');
                    divTextQuestion.className='text-question';
                    divTextQuestion.setAttribute('id','question-body'+i);
                    divTextQuestion.innerHTML =''; //ESTO va a cambiar-----------------------------
					
					//Estará escondido para aparecer cuando el mod de click en see more
					var divTextQuestionHide = document.createElement('div');
                    divTextQuestionHide.className='text-question';
                    divTextQuestionHide.setAttribute('id','question'+i);
                    divTextQuestionHide.innerHTML =''; //ESTO va a cambiar-----------------------------

                    //Letrero Start Date
                    var divStartDate = document.createElement('div');
                    divStartDate.className='text-header';
                    divStartDate.innerHTML = localStorage.getItem('str61');

                    //Fecha que la pregunta se creará
                    var divDateInfo = document.createElement('div');
                    divDateInfo.className='text-info';
                    divDateInfo.innerHTML = ''; //Cambiar -------------------------------------------
                    divDateInfo.setAttribute('id','date-question'+i);

                    //Letrero True Answer
                    var divTrueAnswer = document.createElement('div');
                    divTrueAnswer.className='text-header';
                    divTrueAnswer.innerHTML=localStorage.getItem('str50');

                    //Contiene la respuesta correcta
                    var trueAnswer = document.createElement('div');
                    trueAnswer.className='text-info';
                    trueAnswer.innerHTML=''; //Cambiar-------------------------------------------
                    trueAnswer.setAttribute('id','question-trueanswer'+i);


                    //Letrero primera opcion
                    var divOptionOne = document.createElement('div');
                    divOptionOne.className = 'text-header';
                    divOptionOne.innerHTML = localStorage.getItem('str51');

                    //Contiene la primera opcion
                    var optionOne = document.createElement('div');
                    optionOne.className = 'text-info';
                    optionOne.innerHTML = ''; //Cambiar----------------------------------------------
                    optionOne.setAttribute('id','question-option1'+i);
					

                    //Letrero segunda opcion
                    var divOptionTwo = document.createElement('div');
                    divOptionTwo.className = 'text-header';
                    divOptionTwo.innerHTML = localStorage.getItem('str51');


                    //contiene la segunda opcion
                    var optionTwo = document.createElement('div');
                    optionTwo.className = 'text-info';
                    optionTwo.innerHTML = ''; //Cambiar---------------------------------
                    optionTwo.setAttribute('id','question-option2'+i);
					

                    //contiene los botones
                    var divButtons = document.createElement('div');
                    divButtons.className = 'buttons';
					divButtons.setAttribute('id', JSONdata.questions[i].id);

                    //botón editar
                    var btnEdit = document.createElement('button');
					btnEdit.setAttribute('id', JSONdata.questions[i].id);
                    btnEdit.className = 'edit';
                    btnEdit.innerHTML = localStorage.getItem('str46');
					btnEdit.setAttribute('onClick', 'updateAnswers(this.parentNode.parentNode.parentNode, this.id);');

                    //botón borrar
                    var btnDelete = document.createElement('button');
					btnDelete.setAttribute('id', JSONdata.questions[i].id);
                    btnDelete.className = 'cancel';
                    btnDelete.innerHTML = localStorage.getItem('str44'); //Cambiar
                    btnDelete.setAttribute('onclick', 'showModal(400, 200, "'+localStorage.getItem('str57')+'", this.id);');


                    //añadir botones al div Padre
                    divButtons.appendChild(btnEdit);
                    divButtons.appendChild(btnDelete);                   


                    //añadir al div padre question
                    divQuestion.appendChild(divHead);					
					divQuestion.appendChild(divSend);
                    divQuestion.appendChild(divMore);
                    divQuestion.appendChild(divHide);
					divQuestion.appendChild(divTextQuestion);
					
					//añadir divs que contienen la info al div Hide
                    divHide.appendChild(divTextQuestionHide);
					divHide.appendChild(divStartDate);
                    divHide.appendChild(divStartDate);
                    divHide.appendChild(divStartDate);
                    divHide.appendChild(divDateInfo);
                    divHide.appendChild(divTrueAnswer);
                    divHide.appendChild(trueAnswer);
                    divHide.appendChild(divOptionOne);
                    divHide.appendChild(optionOne);
                    divHide.appendChild(divOptionTwo);
                    divHide.appendChild(optionTwo);
                    divHide.appendChild(divButtons);

                    //añadir divQuestion al padre contenedor    
                    divCont.appendChild(divQuestion);

                    //showTrivia(JSONdata);
                    document.getElementById("question-body"+i).innerHTML = JSONdata.questions[i].question;
					document.getElementById("question"+i).innerHTML = JSONdata.questions[i].question;
                    document.getElementById("date-question"+i).innerHTML = JSONdata.questions[i].date;
                    document.getElementById("question-trueanswer"+i).innerHTML = JSONdata.questions[i].answeroptions[0].answer;
                    document.getElementById("question-option1"+i).innerHTML = JSONdata.questions[i].answeroptions[1].answer;
                    document.getElementById("question-option2"+i).innerHTML = JSONdata.questions[i].answeroptions[2].answer;

                }//for
            }//else
            
            //Mostrar el botón para anadir pregunt
            addButton();
		}
	}
}

/**
*Esta funcion muestra un nuevo formulario
*/
/**Modificado por Dalia Pinto 18/03**/
function addFormQuestion()
{
    //Acceso al div Padre 
    var divCont = document.getElementById('cont');   
    
    //acceso al div create question, contiene el botón add question
    var divCreateQuestion = document.getElementById('create-question');
    
    //nuevo botón Add new question
    divCont.removeChild(divCreateQuestion);
    
    //Crear un div contenedor del formulario
    var divFormQuestion = document.createElement('div');
    divFormQuestion.setAttribute('id', 'form-question');
    
    //crear un div con instruccion para escribir pregunta
    var divText = document.createElement('div');
    divText.className = 'text-instructions';
    divText.innerHTML = localStorage.getItem('str37');
    
    //crear un div con un text area
    var divArea = document.createElement('div');
    divArea.className = 'write-question';
    
    var textArea = document.createElement('textarea');
	textArea.setAttribute('id','question-trivia');
	textArea.setAttribute('onkeypress', 'return (event.keyCode !=13);');
    divArea.appendChild(textArea);
    textArea.focus();
    
    //crear un div para la respuesta correcta
    var divTrueAnswer = document.createElement('div');
	
    divTrueAnswer.className='text-instructions';
    divTrueAnswer.innerHTML= localStorage.getItem('str50');
    
    //crear div e input para anadir TrueAnswer
    var divInputTrue = document.createElement('div');
    divInputTrue.className='text-options';
    var inputTrue = document.createElement('input');
    inputTrue.setAttribute('type', 'text');
    inputTrue.setAttribute('id','trueanswer');
    
    divInputTrue.appendChild(inputTrue); 
    
    //crear un div para las opciones
    var divFirst = document.createElement('div');
    divFirst.className='text-instructions';
    divFirst.innerHTML=localStorage.getItem('str51');
    
    //div para contener los inputs
    var divInputs = document.createElement('div');
    divInputs.className = 'text-options';
    
    var inputOne = document.createElement('input');
    inputOne.setAttribute('type', 'text');
	inputOne.setAttribute('id','option1');
    
    var inputTwo = document.createElement('input');
    inputTwo.setAttribute('type', 'text');
	inputTwo.setAttribute('id','option2');
    
    divInputs.appendChild(inputOne);
    divInputs.appendChild(inputTwo);
    
    /*
    //div para instruccion de seleccionar en datepicker
    var divSelect = document.createElement('div');
    divSelect.className='text-instructions';
    divSelect.innerHTML = localStorage.getItem('str62');
    
    //div para datepicker
    var divPicker = document.createElement('div');
    divPicker.className='picker';
    
    var inputPicker = document.createElement('input');
    inputPicker.setAttribute('type', 'datetime-local');
    inputPicker.setAttribute('id', 'date-picker');
    inputPicker.setAttribute('name', 'date-picker');
    inputPicker.setAttribute('value', '');
    
    var imgPicker = document.createElement('img');
    imgPicker.src='Images/calendar2.png';
    
    divPicker.appendChild(inputPicker);
    divPicker.appendChild(imgPicker);*/
    
    //div para contener botones
    var divButtons = document.createElement('div');
    divButtons.className = 'buttons';
    
    var btnSave = document.createElement('button');
	btnSave.setAttribute('onclick', 'saveQuestion()');
    btnSave.innerHTML=localStorage.getItem('str39');
    btnSave.className='save';
    
    var btnCancel = document.createElement('button');
    btnCancel.setAttribute('onclick', 'cancelQuestion()');
    btnCancel.innerHTML=localStorage.getItem('str40');
    btnCancel.className='cancel';
    
    divButtons.appendChild(btnSave);
    divButtons.appendChild(btnCancel);
    
    //Añadir todos los divs al divFormQuestion
    divFormQuestion.appendChild(divText);
    divFormQuestion.appendChild(divArea);
    divFormQuestion.appendChild(divTrueAnswer);
    divFormQuestion.appendChild(divInputTrue);
    divFormQuestion.appendChild(divFirst);
    divFormQuestion.appendChild(divInputs);
    /*divFormQuestion.appendChild(divSelect);
    divFormQuestion.appendChild(divPicker);*/
    divFormQuestion.appendChild(divButtons);
    
    divCont.appendChild(divFormQuestion);
	
	//focus text-area
	textArea.focus();
    
}

/**Modificado por Dalia Pinto 18/03**/
function cancelQuestion()
{

	addButton();
    
    var divCont = document.getElementById('cont');
    var divForm = document.getElementById('form-question');    
    cont.removeChild(divForm)
	
	
}

var idquestion;
function saveQuestion()
{
    var question = document.getElementById('question-trivia').value;
	//var date = new Date();
	//alert(date)
	if(question.length==0)
	{
		alert("Invalid question " + question);
	}
	var idconf = localStorage.getItem('id');
    var idmoderador = localStorage.getItem('idmoderador');
	x.open('POST', urlServer + 'addquestiontrivia.php', true);
	//send request
	var data = new FormData();
	data.append('txtquestion', question);
	data.append('txtidconf', idconf);
	//data.append('txtdate', date);
	data.append('txtstatus', 't');
    data.append('txtiduser', idmoderador)

	x.send(data);
	//event handler
	x.onreadystatechange = function()
	{
		if(x.status ==200 & x.readyState == 4)
		{
			console.log(x.responseText);
			var JSONdata = JSON.parse(x.responseText);
            
            localStorage.setItem('idquestion', JSONdata.id);
            idquestion = localStorage.getItem('idquestion');
            console.log(idquestion);
			saveAnswers();
            var divMessage = document.getElementById('message');
            divMessage.innerHTML = ''
		}
	}
	
}

function saveAnswers()
{
	console.log(idquestion);
	var trueanswer = document.getElementById('trueanswer').value;
	var date = new Date();
    idquestion = localStorage.getItem('idquestion');
    
	x.open('POST', urlServer + 'addanswertrivia.php', true);
	var data = new FormData();
	data.append('answer', trueanswer);
	data.append('date', date);
	data.append('idquestion', idquestion);
    x.send(data);
	//event handler
	x.onreadystatechange = function()
	{
		if(x.status ==200 & x.readyState == 4)
		{
			console.log(x.responseText);
			var JSONdata = JSON.parse(x.responseText);
            localStorage.setItem('idtrueanswer', JSONdata.id);
			saveAnswer2();
		}
	}
    
   
}

function saveAnswer2()
{
    var option1 = document.getElementById('option1').value;
	var date = new Date();
	
    idquestion = localStorage.getItem('idquestion');
     x.open('POST', urlServer + 'addanswertrivia.php', true);
	var data = new FormData();
	data.append('answer', option1);
	data.append('date', date);
	data.append('idquestion', idquestion);
    x.send(data);
	//event handler
	x.onreadystatechange = function()
	{
		if(x.status ==200 & x.readyState == 4)
		{
			console.log(x.responseText);
			var JSONdata = JSON.parse(x.responseText);
			saveAnswer3();
		}
	}
    
}
function saveAnswer3()
{
	var option2 = document.getElementById('option2').value;
	var date = new Date();   
    idquestion = localStorage.getItem('idquestion');
    
    x.open('POST', urlServer + 'addanswertrivia.php', true);
	var data = new FormData();
	data.append('answer', option2);
	data.append('date', date);
	data.append('idquestion', idquestion);
    x.send(data);
	//event handler
	x.onreadystatechange = function()
	{
		if(x.status ==200 & x.readyState == 4)
		{
			console.log(x.responseText);
			var JSONdata = JSON.parse(x.responseText);
			updateQuestion();
		}
	}
    
    
}
/**Modificado por Dalia Pinto 18/03**/
function updateQuestion()
{
    idquestion = localStorage.getItem('idquestion');
    var idtrueanswer = localStorage.getItem('idtrueanswer');
    x.open('POST', urlServer + 'updatequestiontrivia.php', true);
    
	var data = new FormData();
	data.append('id', idquestion);
    console.log(idquestion)
	data.append('trueanswer', idtrueanswer);
    x.send(data);
	//event handler
	x.onreadystatechange = function()
	{
		if(x.status ==200 & x.readyState == 4)
		{
			console.log(x.responseText);
			var JSONdata = JSON.parse(x.responseText);
			
			cancelQuestion();
            clean();
            getQuestions();
            
            //NO REPETIR EL BOTÓN DE ANADIR PREGUNTA    
            var btnAdd = document.getElementById('create-question');
			var cont = document.getElementById('cont');
            
			cont.removeChild(btnAdd);
    
			
			
		}
	}
}

function clean()
{
    largearray = localStorage.getItem('largearray');
    console.log(largearray);
    
    
    for(var i = 0 ; i< largearray; i++)
    {
        var questions = document.getElementById('questions');
        var divCont = document.getElementById('cont');
        divCont.removeChild(questions);
		
		//NO REPETIR EL BOTÓN DE ANADIR PREGUNTA    
            var btnAdd = document.getElementById('btn-add-question');
            btnAdd.disabled= true;
	        btnAdd.style.display='none';
    }
    
    
}

/**Creado por Dalia Pinto 01/07 -**/
/**********************TRIVIA ASISTENTE**************/
					
function closeMessage ()
{
	var divContent = document.getElementById('cont');
	var error= document.getElementById('msg-error')
	var ok =document.getElementById('ok-button');

	divContent.removeChild(error);
	divContent.removeChild(ok);
}

function showAllInfo()
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
			getQuestions();
			//showAllAcept();
			//showAllDecline();
		}
	}
	
}

/*************Start Trivia Button******************++*/


/*Funciones que deberían visualizarse en play-trivia.html*/
function conferenceInfo()
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
		}
	}
	
}


function questionTrivia(data)
{
	var divQuestion = document.getElementById('show-question');
	var divMessage = document.getElementById('messageTrivia');
	
	var newData;
	
	if(data == null)
	{
		divMessage.innerHTML = localStorage.getItem('str33');
		try{
		newData = JSON.parse(localStorage.getItem("dataQuestion"));
		}catch(err){
			console.log(err.message);
		}
	}
	else{
		//delete the message if data question is != null
		divQuestion.removeChild(divMessage);
		newData = data;
	}
	
	
	
	//crear titulo de pregunta
	var divHeader = document.createElement('div');
	divHeader.className = 'txt-option';
	divHeader.setAttribute('id', '1'); //cambiar id
	divHeader.innerHTML='Question'; //Cambiar
	
	//crear div para la pregunta
	var divInforQuestion = document.createElement('div');
	divInforQuestion.className = 'txt-question';
	divInforQuestion.setAttribute('id', '2'); //cambiar id
	divInforQuestion.innerHTML=newData.question; //Cambiar
	
	localStorage.setItem('question', newData.id);
	
	//Instrucción de las opciones
	var divTitleOption = document.createElement('div');
	divTitleOption.className = 'txt-option';
	divTitleOption.setAttribute('id', '3'); //cambiar id
	divTitleOption.innerHTML='Select an option'; //Cambiar
	
	/*Random Answers*/
	var i = 0;
    var indexs = [];
    var aux = 0;
    indexs[0] = 0;
    indexs[1] = 1;
    indexs[2] = 2;

    for(var x = 0; x < 3; x++)
    {
        i = Math.floor((Math.random() * 3));
        aux = indexs[x];
        indexs[x] = indexs[i];
        indexs[i] = aux;
    }

	
	//Primera opcion
	var firstOption = document.createElement('div');
	var first = newData.answeroptions[indexs[0]];
	firstOption.className = 'div-option';
	firstOption.setAttribute('id', '4'); //cambiar id
	firstOption.innerHTML=first.answer; //Cambiar
	firstOption.setAttribute('onclick', 'getScore('+newData.id+', '+first.idanswer+');');
	
	//Segunda Opcion
	var secondOption = document.createElement('div');
	var second = newData.answeroptions[indexs[1]];
	secondOption.className = 'div-option';
	secondOption.setAttribute('id', '5'); //cambiar id
	secondOption.innerHTML= second.answer; //Cambiar
	secondOption.setAttribute('onclick', 'getScore('+newData.id+', '+second.idanswer+');');
	
	//Tercera Opcion
	var thirdOption = document.createElement('div');
	var third = newData.answeroptions[indexs[2]];
	thirdOption.className = 'div-option';
	thirdOption.setAttribute('id', '6'); //cambiar id
	thirdOption.innerHTML=third.answer; //Cambiar
	thirdOption.setAttribute('onclick', 'getScore('+newData.id+', '+third.idanswer+');');


	//Crear div con el tiempo
	var divTimer = document.createElement('div');
	divTimer.setAttribute('id', 'div-timer');
	
	divQuestion.appendChild(divHeader);
	divQuestion.appendChild(divInforQuestion);	
	divQuestion.appendChild(divTitleOption);
	divQuestion.appendChild(firstOption);
	divQuestion.appendChild(secondOption);
	divQuestion.appendChild(thirdOption);
	divQuestion.appendChild(divTimer);
}



//Arreglar timer, dar refresh y que no se reinicie,
//arreglar timer, que si se esta en play-trivia.html no cuente si no hay preguntas.







