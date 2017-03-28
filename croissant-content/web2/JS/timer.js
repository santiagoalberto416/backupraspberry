var date = localStorage.getItem('date');
var time = 0;
var oldDate;


function timer(){

    if(date != null){
        
        //console.log('date string ' + localStorage.getItem('date')/1000);
        oldDate = localStorage.getItem('date');
    }
    else{
        //declarar un date de hoy
        var actualDate = new Date().getTime();
        var number = actualDate/1000;
        localStorage.setItem('date', number);
        
        /*console.log('actual date '+ actualDate);
        console.log('number ' + number);*/
    }
    if(oldDate != null){
        
     var hora1 = new Date(new Date().getTime())/1000;
     var hora2 = oldDate;
        console.log('oldDate ' + oldDate);
        console.log('hora1 o today ' + hora1);
        console.log('hora2 ' + hora2);
        
        //Aquí hago la resta
        var totalDate = hora1 - hora2;
        
        console.log('totalDate ' + totalDate);
        
        time = Math.round(totalDate);
            console.log('time ' + time);
            
        countDown(time);
        
    }else
    {
        //iniciar el timer normalmente de 0 a 15
    }
}//function


var count = 16;
var counter = setInterval(timer, 1000);

function countDown(time) //enviar parametro con el resultado de la resta.
{
    var countDown = count - time;
    countDown=countDown-1;
    
    if (countDown <= 0)
    {
                
                window.location = 'scores.html';
                
                var divCont = document.getElementById('cont');
                var divQuest = document.getElementById('show-question');
                localStorage.removeItem("dataQuestion");
                localStorage.removeItem('date');
                
                divCont.removeChild(divQuest);
                
        clearInterval(counter);
        return;
    }
    localStorage.setItem('time', countDown);
    document.getElementById("div-timer").innerHTML= localStorage.getItem('str67') + " " + localStorage.getItem('time') + " " + localStorage.getItem('str68'); 
}

