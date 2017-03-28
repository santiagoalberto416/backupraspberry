var urlServer = 'https://croissant-santy-ruler.c9users.io/croissant/';//modificar una vez se cambie de nombre a la carpeta
//var urlImages 
var x = new XMLHttpRequest();

var photoname;
var nameofevent;
var eventdescription;
var idTheme;

var colors = [ 
    
    //red 01
    ["#D32F2F", "#F44336", "#FFCDD2", "#FFFFFF"],
    //pink 02
    ["#C2185B", "#E91E63", "#F8BBD0", "#FFFFFF"],
    //purple 03
    ["#7B1FA2", "#9C27B0", "#E1BEE7", "#FFFFFF"],
    //deep purple 04
    ["#512DA8", "#673AB7", "#D1C4E9", "#FFFFFF"],
    //indigo 05
    ["#303F9F", "#3F51B5", "#C5CAE9", "#FFFFFF"],
    //blue 06
    ["#1976D2","#2196F3", "#BBDEFB", "#FFFFFF"],
    //light blue 07
    ["#0288D1","#03A9F4", "#03A9F4", "#FFFFFF"],
    //cyan 08
    ["#0097A7", "#00BCD4", "#B2EBF2", "#FFFFFF"],
    //teal 09
    ["#00796B", "#009688", "#B2DFDB", "#FFFFFF"],
    //green 10
    ["#388E3C", "#388E3C", "#388E3C", "#FFFFFF"],
    //light green 11
    ["#689F38", "#8BC34A", "#DCEDC8", "#FFFFFF"],
    //lime 12
    ["#AFB42B", "#CDDC39", "#F0F4C3", "#212121"],
    //yellow 13
    ["#FBC02D", "#FFEB3B", "#FFF9C4", "#212121"],
    //amber 14
    ["#FFA000", "#FFC107", "#FFECB3", "#212121"],
    //orange 15
    ["#F57C00", "#FF9800", "#FFE0B2", "#FFFFFF"],
    //deep orange 16
    ["#E64A19", "#E64A19","#FFCCBC", "#FFFFFF"],
    //brown 17
    ["#5D4037", "#795548", "#D7CCC8", "#FFFFFF"],
    //grey 18
    ["#616161", "#9E9E9E", "#F5F5F5", "#212121"],
    //blue gray 19
    ["#455A64", "#607D8B", "#CFD8DC", "#FFFFFF"]
    
    ];
    
var position1 = -1;
var position2 = -1;
var thiscolors = [];

function setColors(){
    for(var y=0; y<19; y++){
        var x = document.getElementById(y)
        x.style.backgroundColor = colors[y][0]  ;
    }
}
    
function getColors(primary, ascent){
    
    
    thiscolors = [ colors[primary][0], colors[primary][1], colors[primary][2], colors[ascent][0], colors[primary][3]];
    
                    
    console.log("Dark primary:"+thiscolors[0]+",primary:"+thiscolors[1]+",light primary:"+thiscolors[2]+",ascent:"+thiscolors[3]+",text icons:"+thiscolors[4]);
    
}

function setPositions(position){
    if(isNaN(position)==false){
        var x = document.getElementById(position)
            if(position==position1 && position2>-1){
                var y = document.getElementById(position2);
                y.style.opacity = 1 ;
                position2 = -1;
            }
            else if(position1==position){
            position1 = -1;
            x.style.opacity = 1 ;
            }
            else if(position2 == position &&  position1>-1){
                position2 = -1
                x.style.opacity = 1 ;
            }
            else if(position1>-1){
                if(position2>-1){
                var y = document.getElementById(position2);
                y.style.opacity = 1;
                }
                position2 = position;
                console.log("position2="+ position2);
                checkPositions();
                
                x.style.opacity = 0.5 ;
            }else{
                if(position1>-1){
                var y = document.getElementById(position1);
                y.style.opacity = 1;
                }
                position1 = position;
                console.log("position1="+ position1);
                checkPositions();
                
                x.style.opacity = 0.5 ;
            }
    }
}

function checkPositions(){
    if(position1>-1&&position2>-1){
        getColors(position1, position2);
    }
}

function showname(){
    
    var filename;
    
    var name = document.getElementById('name').value;
    nameofevent = name;
    var description = document.getElementById('description').value;
    eventdescription = description
    
    var fullPath = document.getElementById('file').value;
    if (fullPath) {
        var startIndex = (fullPath.indexOf('\\') >= 0 ? fullPath.lastIndexOf('\\') : fullPath.lastIndexOf('/'));
        var filename = fullPath.substring(startIndex);
        if (filename.indexOf('\\') === 0 || filename.indexOf('/') === 0) {
            filename = filename.substring(1);
        }
        photoname = filename;
    }
    
    sendTheme();
    
}
function onSucess(){
    var name = localStorage.getItem("name");
    var description = localStorage.getItem("description");
    var idTheme = localStorage.getItem("idTheme");
    var filename = localStorage.getItem("filename");
    
    x.open('POST', urlServer + 'addEvent.php', true);
        	//send request
        	var data = new FormData();
        	data.append('name', name);
        	data.append('description', description);
        	data.append('idTheme', idTheme);
        	data.append('filename', filename);
        
        	x.send(data);
        	//event handler
        	x.onreadystatechange = function()
        	{
        		if(x.status ==200 & x.readyState == 4)
        		{
        			var jsondata = JSON.parse(x.responseText);
        			console.log(jsondata);
        		}
        	}
}


function sendTheme(){
    if(position1!=null && position2!=null){
        console.log("Dark primary:"+thiscolors[0]+",primary:"+thiscolors[1]+",light primary:"+thiscolors[2]+",ascent:"+thiscolors[3]+",text icons:"+thiscolors[4]);

        	x.open('POST', urlServer + 'newTheme.php', true);
        	//send request
        	var data = new FormData();
        	data.append('dark', thiscolors[0]);
        	data.append('primary', thiscolors[1]);
        	data.append('light', thiscolors[2]);
        	data.append('ascent', thiscolors[3]);
        	data.append('text', thiscolors[4]);
        
        	x.send(data);
        	//event handler
        	x.onreadystatechange = function()
        	{
        		if(x.status ==200 & x.readyState == 4)
        		{
        			var jsondata = JSON.parse(x.responseText);
        			idTheme = jsondata.id;
        			alert(
        			"name:"+ nameofevent+
        			" description:"+eventdescription+
        			" idTheme:"+idTheme+ 
        			" filename:"+photoname);
        			
        			// Store
                    localStorage.setItem("name", nameofevent);
                    localStorage.setItem("description", eventdescription);
                    localStorage.setItem("idTheme", idTheme);
                    localStorage.setItem("filename", photoname);
                    // Retrieve
                    //document.getElementById("result").innerHTML = localStorage.getItem("lastname");
                    onSucess();
        		}
        	}
    }
}