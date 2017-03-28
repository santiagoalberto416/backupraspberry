/*Creado por Dalia Pinto 20/03 */

//Variables
var modalVisible = false;
var modalWidth = 0;
var modalHeight = 0;
//on resize event
window.onresize = function()
{
	if(modalVisible) modalPosition();
}
//on scroll event
window.onscroll = function()
{
	if(modalVisible) modalPosition();
}
//display size and position
function modalPosition()
{
	//cover
	var divCover = document.getElementById('cover');
	divCover.style.width = window.innerWidth;
	divCover.style.height = window.innerHeight;
	divCover.style.left = window.pageXOffset;
	divCover.style.top = window.pageYOffset;
	//modal
	var divModal = document.getElementById('modal');
	divModal.style.left = ((window.innerWidth - modalWidth)/2) + window.pageXOffset;
	divModal.style.top = ((window.innerHeight - modalHeight)/2) + window.pageYOffset;
}
//show modal
function showModal(width, height, title, id)
{
	console.log(id);
	//content 
	var divContent = document.getElementById('content');
	//create cover 
	var divCover = document.createElement('div');
	//id
	divCover.setAttribute('id', 'cover');
	divCover.setAttribute('onclick', 'closeModal();');
	//add to document
	divContent.appendChild(divCover);
	//create modal
	var divModal = document.createElement('div');
	//id
	divModal.setAttribute('id', 'modal');
	//size
	divModal.style.width = width; modalWidth = width;
	divModal.style.height = height; modalHeight = height;
	//modal titlw
	var divTitleBar = document.createElement('div');
	var divTitle = document.createElement('div');
	var divClose = document.createElement('div');
	//id
	divTitleBar.setAttribute('id', 'titlebar');
	divTitle.setAttribute('id', 'title');
	divClose.setAttribute('id', 'close');
	//title content
	divTitle.innerHTML = title;
	//close content
	var btnClose = document.createElement('button');
	btnClose.innerHTML = 'X';
	btnClose.setAttribute('onClick', 'closeModal();')
	divClose.appendChild(btnClose);
	//add to title bar
	divTitleBar.appendChild(divTitle);
	divTitleBar.appendChild(divClose);
	//add to title modal
	divModal.appendChild(divTitleBar);
	
	var divAlert = document.createElement('div');
	divAlert.className = 'cont-alert';
	
	var divMessage = document.createElement('div');
	divMessage.innerHTML = localStorage.getItem('str53');
	divMessage.className = 'div-alert';
	
		
	var divBtn = document.createElement('div');
	divBtn.className = 'div-btn';
	
	var btnAccept = document.createElement('button');	
	btnAccept.innerHTML = localStorage.getItem('str54');
	btnAccept.setAttribute('onclick', 'deleteAnswersTrivia('+id+');closeModal();');
	btnAccept.className = 'btn-accept';
	
	var btnCancel = document.createElement('button');
	btnCancel.innerHTML = 'No';
	btnCancel.setAttribute('onclick', 'closeModal();');
	btnCancel.className = 'btn-cancel';
	
	
	divBtn.appendChild(btnAccept);
	divBtn.appendChild(btnCancel);
	
	
	
	//divAlert.appendChild(img);	
	divAlert.appendChild(divMessage);
	divAlert.appendChild(divBtn);
	
	divModal.appendChild(divAlert);
	//add to document
	divContent.appendChild(divModal);
	//modal is visible
	modalVisible = true;
	//position modal
	modalPosition();
}

//close modal
function closeModal()
{
	//elements
	var divContent = document.getElementById('content');
	var divCover = document.getElementById('cover');
	var divModal = document.getElementById('modal');
	//remove Child
	divContent.removeChild(divCover);
	divContent.removeChild(divModal);
	//modal not visible
	modalVisible = false;
}


/*<label>innerWidth : </label><input type="text" id="txtWidth"></input>
		<br>
		<label>innerHeigth : </label><input type="text" id="txtHeight"></input>
		<br>
		<label>pageYOffset : </label><input type="text" id="txtY"></input>
		<br>
		<label>pageXOffset : </label><input type="text" id="txtX"></input>
		<br>	
	<div id ="cover"></div>
*/