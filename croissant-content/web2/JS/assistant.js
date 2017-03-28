jQuery(function($) {
	var socket = io.connect();
	socket.on('newQuestion', function(data){
		
		//$('#onhold').append(data.id + ' User: ' + data.userId + ' Question: ' + data.question + ' Date: ' + data.date +  '<br/>');
		showNotificationNewQuestion(data);
	});
});