jQuery(function($) {
	var socket = io.connect();
	socket.on('newSpeaker', function(data){
		
		//$('#onhold').append(data.id + ' User: ' + data.userId + ' Question: ' + data.question + ' Date: ' + data.date +  '<br/>');
        console.log(data);
        showNotificationNewQuestion(data)
        //alert(data.id)
		//showAllMessages(data);
	});
});