jQuery(function($) {
	var socket = io.connect();
	socket.on('newMessage', function(data){
		
		//$('#onhold').append(data.id + ' User: ' + data.userId + ' Question: ' + data.question + ' Date: ' + data.date +  '<br/>');
		showAllMessages(data);
	});
});