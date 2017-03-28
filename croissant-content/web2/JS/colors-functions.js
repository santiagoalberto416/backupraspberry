(function(code) {

    code(window.jQuery, window, document);

}(function($, window, document) {
    
        window.COLORS = COLORS = [ 
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
    
        window.showColors = function showColors()
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
    
    
        window.selectColors = function selectColors(e)
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
                
                $("#event-primary-color").val($divClicked.attr("data-position"));
                
                if($lastPrimary.is($checked)) $lastAccent.remove();
                
                if($lastAccent.is($checked)) $lastPrimary.remove();
            }
            
        }
        
        window.setColors = function setColors(primary, ascent)
        {
            var $colorsConteiner = $("#form-colors-conteiner");
            
            $.each(COLORS, function(index, item){
               var color = item.colors[0];
                
                if(color === primary)
                {
                    
                    var $color = $colorsConteiner.find("[data-position='"+ index + "']");
                    var $checkedTemplate = $('<div class="color-checked" data-checked="primary">\
                        <div style="text-transform: capitalize;">primary</div>\
                        <img src="Images/ic_check_circle_white_24px.svg">\
                    </div>');
                    
                    $color.append($checkedTemplate);
                    $("#event-primary-color").val(index);
                }
                
                if(color === ascent)
                {
                    var $color = $colorsConteiner.find("[data-position='"+ index + "']");
                    var $checkedTemplate = $('<div class="color-checked" data-checked="accent">\
                        <div style="text-transform: capitalize;">accent</div>\
                        <img src="Images/ic_check_circle_white_24px.svg">\
                    </div>');
                    $color.append($checkedTemplate);
                    $("#event-accent-color").val(index);
                }
                
            });
        }
        
    }
  
));

