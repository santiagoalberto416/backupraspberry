(function(code) {

    code(window.jQuery, window, document);

}(function($, window, document) {
    
        var URL_SERVER = "https://croissant-santy-ruler.c9users.io/croissant/";
        var ID_EVENT = null;
        var COLORS = [ 
            //red 01
            {
                name : "Red",
                colors : ["#D32F2F", "#F44336", "#FFCDD2", "#FFFFFF"]
            },
            //pink 02
            {
                name : "Pink",
                colors : ["#C2185B", "#E91E63", "#F8BBD0", "#FFFFFF"]
            },
            {//purple 03
                name : "Purple",
                colors : ["#7B1FA2", "#9C27B0", "#E1BEE7", "#FFFFFF"]
            },
            //deep purple 04
            {
                name : "Deep Purple",
                colors : ["#512DA8", "#673AB7", "#D1C4E9", "#FFFFFF"]
            },
            //indigo 05
            {
                name : "Indigo",
                colors : ["#303F9F", "#3F51B5", "#C5CAE9", "#FFFFFF"]
            },
            //blue 06
            {
                name : "Blue",
                colors : ["#1976D2","#2196F3", "#BBDEFB", "#FFFFFF"]
            },
            //light blue 07
            {
                name : "Light Blue",
                colors : ["#0288D1","#03A9F4", "#03A9F4", "#FFFFFF"]
            },
            //cyan 08
            {
                name : "Cyan",
                colors : ["#0097A7", "#00BCD4", "#B2EBF2", "#FFFFFF"]
            },
            //teal 09
            {
                name : "Teal",
                colors : ["#00796B", "#009688", "#B2DFDB", "#FFFFFF"]
            },
            //green 10
            {
                name : "Green",
                colors : ["#388E3C", "#388E3C", "#388E3C", "#FFFFFF"]
            },
            //light green 11
            {
                name : "Light Green",
                colors : ["#689F38", "#8BC34A", "#DCEDC8", "#FFFFFF"]
            },
            //lime 12
            {
                name : "Lime",
                colors : ["#AFB42B", "#CDDC39", "#F0F4C3", "#212121"]
            },
            //yellow 13
            {
                name : "Yellow",
                colors : ["#FBC02D", "#FFEB3B", "#FFF9C4", "#212121"]
            },
            //amber 14
            {
                name : "Amber",
                colors : ["#FFA000", "#FFC107", "#FFECB3", "#212121"]
            },
            //orange 15
            {
                name : "Orange",
                colors : ["#F57C00", "#FF9800", "#FFE0B2", "#FFFFFF"]
            },
            //deep orange 16
            {
                name : "Deep Orange",
                colors : ["#E64A19", "#E64A19","#FFCCBC", "#FFFFFF"]
            },
            //brown 17
            {
                name : "Brown",
                colors : ["#5D4037", "#795548", "#D7CCC8", "#FFFFFF"]
            },
            //grey 18
            {
                name : "Grey",
                colors : ["#616161", "#9E9E9E", "#F5F5F5", "#212121"]
            },
            //blue gray 19
            {
                name : "Blue Grey",
                colors : ["#455A64", "#607D8B", "#CFD8DC", "#FFFFFF"]
            }

        ];
        var LOGO_NAME = "";
    
        $(function() {
            
            showInfo();
            
            addEvent().done(function(data){
                
                
                console.log(data);
                
                var jsonResult = JSON.parse(data);
                
                ID_EVENT = jsonResult.id;
                
                $("#event-id").val(ID_EVENT);
                
                console.log(ID_EVENT);
                
            });

            
            showColors();
            
            
            $(".form-color-item").on("click", selectColors);
            
            
            $('#form-logo-conteiner').click(function(){
                
                $('#file').trigger('click');
                
            });
            
            
            $("#file").change(function(){
                
                removeLogo();
                uploadLogo();
                
            });
            
            
            autosize($('#event-description'));
            
            
            $('#form-add-event').validate({
                ignore: "",
                rules: {
                    name: {
                        required: true
                    },
                    description: {
                        required: true
                    },
                    filename: {
                        required: true
                    },
                    eventPrimaryColor: {
                        required: true
                    },
                    eventAccentColor: {
                        required: true
                    }
                },
                messages: {
                    filename: {
                        required: 'Please, upload an logo.'
                    },
                    eventPrimaryColor: {
                        required: 'Please, select the primary color.'
                    },
                    eventAccentColor: {
                        required: 'Please, select the accent color.'
                    }
                },
                submitHandler: function(form) {
                    
                    addTheme().done(function(data){
                        
                        var jsonResult = JSON.parse(data);
                        
                        updateEvent(jsonResult.id).done(function(data){
                            
                            var resultJson = JSON.parse(data);
                            
                            localStorage.setItem("idevent", resultJson.id);
                            
                            
                            $("#message").modal({ 
                                escapeClose: false,
                                clickClose: false,
                                showClose: false
                            });
                            
                        });
                    });
                }
            });
            
        });
    

        function showColors()
        {
            var $conteinerColors = $("#form-colors-conteiner");
            var $colors = "";

            $.each(COLORS, function(index, item){
                
                $colors += '<div class="form-color-item" style="background: '+ item.colors[0] + ';" data-position="'+ index +'">\
                        <span>'+ item.name +'</span>\
                    </div>';
                
            });
            
            $conteinerColors.append($colors);
        }
    
    
        function uploadLogo()
        {
            var ajax = new XMLHttpRequest();
            var data = new FormData();
            
            data.append("file", document.querySelector("#file").files[0]);
            data.append("eventid", ID_EVENT);
            
            ajax.onreadystatechange=function(e) {
                
                if(ajax.status==200 && ajax.readyState == 4) {
                    
                        var $logoConteiner = $("#form-logo-conteiner");
                        
                        var jsonResult = JSON.parse(ajax.responseText);
                    
                        $("#event-image").val(jsonResult.name);
                        
                        $("#event-image-error").remove();
                        
                        $logoConteiner.css("background", "transparent");
                        
                        $logoConteiner.html("<img src='" + jsonResult.src + "' style='width: 100%;'/>");
                    
                        LOGO_NAME = jsonResult.name;
                    }
            }
            
            ajax.open("POST", URL_SERVER + "upload.php");
            ajax.send(data);
        }
    
    
        function selectColors(e)
        {
            var $divClicked = $(e.currentTarget);
            var $checked = $divClicked.find(".color-checked");
            var titleChecked = "";
            var $colorsConteiner = $("#form-colors-conteiner");
            var $lastPrimary = $colorsConteiner.find("[data-checked='primary']");
            var $lastAccent = $colorsConteiner.find("[data-checked='accent']");
            
            
            if($checked.length == 0) {
                
                if($lastPrimary.length > 0 && $lastAccent.length > 0) { 
                    
                    $lastPrimary.remove(); $lastPrimary = {};
                    
                    $lastAccent.remove(); $lastAccent = {};
                }
                    
                if($lastPrimary.length > 0) {
                    
                    titleChecked = "accent";
                    
                    $("#event-accent-color-error").remove();
                    
                    $("#event-accent-color").val($divClicked.attr("data-position"));
                }
                
                else {
                    
                    titleChecked = "primary";
                    
                    $("#event-accent-color").val("");
                    
                    $("#event-primary-color-error").remove();
                    
                    $("#event-primary-color").val($divClicked.attr("data-position"));
                }
                
                var $checkedTemplate = $('<div class="color-checked" data-checked="' + titleChecked + '">\
                        <div style="text-transform: capitalize;">' + titleChecked + '</div>\
                        <img src="Images/ic_check_circle_white_24px.svg">\
                    </div>');
            
                $divClicked.append($checkedTemplate);
                
                TweenMax.from($checkedTemplate, 0.2, {opacity: 0});
            }
            
            if($checked.length > 0)
            {   
                $checked.attr("data-checked", "primary");
                
                $checked.children(0).html("primary");
                
                $("#event-accent-color").val("");
                
                if($lastPrimary.is($checked)) $lastAccent.remove();
                
                if($lastAccent.is($checked)) $lastPrimary.remove();
            }
        }
    
    
        function removeLogo()
        {
            return $.ajax({
              url: URL_SERVER + "removeImage.php",
              type: "POST",
              data: {imgname : LOGO_NAME }
            });
        }
    
        function addEvent()
        {
            return $.ajax({
              url: URL_SERVER + "addEvent.php",
              type: "POST",
              data: {name : "onhold", description : "onhold", idTheme : "1", filename : "onhold"}
            });
        }
    
        function addTheme()
        {
            var primaryPosition = $("#event-primary-color").val();
            var accentPosition = $("#event-accent-color").val();
            var primaryColors = COLORS[primaryPosition].colors;
            var accentColors = COLORS[accentPosition].colors;
            
            return $.ajax({
              url: URL_SERVER + "newTheme.php",
              type: "POST",
              data: { 
                  dark : primaryColors[0],
                  primary : primaryColors[1],
                  light : primaryColors[2],
                  text : primaryColors[3],
                  ascent : accentColors[0] 
              }
            });
        }
            
        function updateEvent(themeID)
        {
            var eventData = $("#form-add-event").serializeArray();
            
            eventData.push({ name: "idTheme", value: themeID });
            eventData.push({ name: "adminid", value: localStorage.getItem("idadmin")})
            
            return $.ajax({
               type: "POST",
               url: URL_SERVER + 'updateEvent.php',
               data: eventData
            });
        }
    
        function showInfo()
        {
            var user = document.getElementById('user-name');
            name = localStorage.getItem('moderatorname');
            
            user.innerHTML = name;
        }
    
        $.cssHooks.backgroundColor = {
            get: function(elem) {
                if (elem.currentStyle)
                    var bg = elem.currentStyle["background-color"];
                else if (window.getComputedStyle)
                    var bg = document.defaultView.getComputedStyle(elem,
                        null).getPropertyValue("background-color");
                if (bg.search("rgb") == -1)
                    return bg;
                else {
                    bg = bg.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
                    function hex(x) {
                        return ("0" + parseInt(x).toString(16)).slice(-2);
                    }
                    return "#" + hex(bg[1]) + hex(bg[2]) + hex(bg[3]);
                }
            }
        }
    
    
    }
  
));

