/** APP: Ajax Image uploader with progress bar
    Website:packetcode.com
    Author: Krishna TEja G S
    Date: 29th April 2014
***/

$(function(){
$('#uploadButton').click(function(){
	var myFormData = new FormData($('#myForm')[0]);
	console.log(myFormData);

	$.ajax({
	  url: 'upload.php',
	  type: 'POST',
	  processData: false, // important
	  contentType: false, // important
	  data: myFormData
	}).done(function(response){
		console.log(response);
		alert(response);
		
	 	$(".image").html("<img src='"+response+"' width='100%'/>");
	 			// show the image after success
	});
});
	 

	/* // function from the jquery form plugin
	 $('#myForm').ajaxForm({
	 	beforeSend:function(){
	 		 $(".progress").show();
	 	},
	 	uploadProgress:function(event,position,total,percentComplete){
	 		$(".progress-bar").width(percentComplete+'%'); //dynamicaly change the progress bar width
	 		$(".sr-only").html(percentComplete+'%'); // show the percentage number
	 	},
	 	success:function(){
	 		$(".progress").hide(); //hide progress bar on success of upload
	 	},
	 	complete:function(response){
	 		if(response.responseText=='0')
	 			$(".image").html("Error"); //display error if response is 0
	 		else
	 			$(".image").html("<img src='"+response.responseText+"' width='100%'/>");
	 			// show the image after success
	 	}
	 });

	 //set the progress bar to be hidden on loading
	 $(".progress").hide();*/
});
