function redirect()
{
  //'GET',{fields: 'first_name, last_name, name, id'},
  window.location = "ask_question.html"
}

/*function reloadStatus()
{
  setInterval('location.reload()',2000);
} */

function ShowMyName() {
        FB.api("/me",
                function (response) {
                    alert('Name is ' + response.name);
                });

    }

function onFace()
{
  FB.getLoginStatus(function(response) {
  if (response.status === 'connected') {

    console.log('Logged in.');
    console.log('Welcome ' + response.name);


  }
  else {
    FB.login();

  }
});
  setTimeout("redirect()", 9000);
}

function outFace()
{
  FB.logout(function(response) {
    window.location = 'login.html';
});
}


function getName()
{
   /*FB.api('/me',function(response){
     document.getElementById('user-name').innerHTML = response.name;
   });*/

     console.log(response.name);
     /*alert('Your name is ' + response.name);
   });*/
}
