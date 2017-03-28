var URL_SERVER = "https://croissant-santy-ruler.c9users.io/croissant/";


function Conference(id, title, type, description, date, time, place, room) {
    var self = this;
    self.id = id;
    self.title = title;
    self.type = type;
    self.description = description;
    self.date = date;
    self.time = time;
    self.place = place;
    self.room = room;
}

function EventObj(id, name, description, logo, theme, admin) {
    var self = this;
    self.id = ko.observable(id);
    self.name = ko.observable(name);
    self.description = ko.observable(description);
    self.logo = logo;
    self.theme = theme;
    self.admin = ko.observable(admin);
}

function closeModal() {
    $("#conteiner-add-conference").remove();
    $(".jquery-modal").remove();
    $(".xdsoft_datetimepicker").remove();
    $("body").css("overflow-y", "auto");
}


var vm = function AdministrationViewModel() {
    var self = this;
    
    //self.selectedConference = ko.observable()
    
    self.conferences = ko.observableArray([]);
    
    self.temporalImage = "";
    
    self.getConferences = function() {
        
        var data = { txtnickname : "1", id_event: localStorage.getItem("idevent")};
        
        $.post(URL_SERVER + "getconferences.php", data, function(returnedData) {

            var jsonData = JSON.parse(returnedData);
            
            var mappedConferences = $.map(jsonData.conferences, function(item) {
                return new Conference(item.id, item.title, item.type, item.description, item.date, item.time, item.place, item.room);
            });
            
            self.conferences(mappedConferences);

        });
    };
    
    self.showAddElement = function() {
 
            $($.parseHTML(self.templateAddConference())).appendTo("body").modal({
                escapeClose: false,
                clickClose: false,
                showClose: false
            });

            $('#conference-date').datetimepicker({
                timepicker:false,
                format:'Y/m/d'
            });

            $('#conference-time').datetimepicker({
                datepicker:false,
                format: 'H:i'
            });

            $("#close-modal").click(function(){
                closeModal();    
            });

            autosize($('#event-description'));

            $("#form-add-conference").validate({
                rules: {
                    title: {
                        required: true
                    },
                    place: {
                        required: true
                    },
                    room: {
                        required: true
                    },
                    date: {
                        required: true,
                        date: true
                    },
                    time: {
                        required: true,
                        time: true
                    },
                    type: {
                        required: true
                    },
                    description: {
                        required: false
                    }
                },
                submitHandler: function(form) {
                    var data = $("#form-add-conference").serializeArray();
                    data.push({ name: "idevent", value: localStorage.getItem("idevent") });

                    $.ajax({
                       type: "POST",
                       url: URL_SERVER + 'addconference.php',
                       data: data
                    }).done(function(result){

                        var item = JSON.parse(result);

                        if(item.status === 0)
                        {
                            self.conferences.push(new Conference(item.id, item.title, item.type, item.description, item.date, item.time, item.place, item.room));

                            $('.grid').masonry("destroy");
                            $('.grid').masonry({
                              itemSelector: '.grid-item'
                            });

                            closeModal();
                            self.showToast("Conference added successfully!", "Images/ic_done_white_24px.svg")
                        }


                    });
                }
            });


            self.showWindowAnimation($("#conteiner-add-conference"));
    };

    self.eventObj = new EventObj("","","","","","");
    
    self.showInfo = function() {

        if(localStorage.getItem('type') === '1') {
            
            var data = { id: localStorage.getItem("idevent") };

            $.get(URL_SERVER + "getEvent.php", data, function(returnedData){

                var jsonResult = JSON.parse(returnedData);

                self.setEventInfo(jsonResult);

                $("#conteiner-event-logo").append($.parseHTML('<img src="upload/' + jsonResult.logo + '" />'));

                self.setTheme(jsonResult.theme);

                $("body").css("display", "inline");

            });

            $("#user-name").html(localStorage.getItem("moderatorname"));
        }
        else {
            window.location = "presentation.html";
        }

    };
    
    self.showInfoEvent = function() {
            
        var $panelView = $("#panel-view");
        var $addButton = $("#add-button");

        $("body").scrollTop(0);

        self.downFloatingAnimation($addButton, function() { TweenMax.set($addButton, { y: 0, display: "none", opacity: 1 })});

        $panelView.html(self.templateEvent());

        showColors();

        setColors(self.eventObj.theme.primary_dark, self.eventObj.theme.ascent);

        $("#conteiner-logo").append("<img src='upload/" + self.eventObj.logo + "'/>");

        ko.cleanNode($panelView[0]);

        ko.applyBindings(null, $panelView[0]);

        ko.cleanNode($("#event-name")[0]);

        autosize($('#event-description'));

        self.panelViewAnimation($("#form-conteiner-udpate-event"));

        $(".form-color-item").on("click", selectColors);

        $('#conteiner-logo').click(function(){

            $('#file').trigger('click');

        });


        $("#file").change(function(){

            self.removeLogo(self.temporalImage);
            self.uploadLogo("busy" + self.eventObj.id(), self.showLogo);

        });

        $('#form-edit-event').validate({
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
                
                if(self.temporalImage !== "") {
                    
                    self.removeLogo(self.temporalImage);
                    self.removeLogo(self.eventObj.logo);
                    self.uploadLogo(self.eventObj.id(), null);
                }
            
                self.updateTheme().done(function(data){

                    var jsonResult = JSON.parse(data);

                    self.updateEvent(jsonResult.id).done(function(data){

                        var resultJson = JSON.parse(data);

                        if(resultJson.status === 0) {

                            self.setEventInfo(resultJson);

                            self.setTheme(resultJson.theme);

                            self.showToast("Event edited successfully!", "Images/ic_done_white_24px.svg");
                        }
                        else {
                            self.showToast("Error: event not edited.", "Images/ic_error_white_24px.svg");
                        }

                    });
                });
            }
        });
    };
    
    self.setEventInfo = function(jsonResult) {
        var event = self.eventObj;
        event.id(jsonResult.id);
        event.name(jsonResult.name);
        event.description(jsonResult.description);
        event.logo = jsonResult.logo;
        event.theme = jsonResult.theme;
        event.admin(localStorage.getItem("idadmin"));
    };
    
    self.setTheme = function(theme) {        
        
        var style = '<style> .primary-color { background: '+ theme.primary_dark + ';}\
            .text-accent{ color: ' + theme.primary_dark + '}\
            .text-input:focus { box-shadow: 0 2px 0 ' + theme.primary +';} </style>';
        
        $("#add-button").attr("fill", theme.ascent);
        
        $("head").append(style);
        
    };
    
    self.uploadLogo = function(imageName, callback) {
        
        var file = document.querySelector("#file").files[0];
        
        if(file !== undefined) {
            
            var ajax = new XMLHttpRequest();
            var data = new FormData();
            
            data.append("file", file);
            data.append("eventid", imageName);

            ajax.onreadystatechange=function(e) {

                if(ajax.status==200 && ajax.readyState == 4) {

                        var jsonResult = JSON.parse(ajax.responseText);

                        self.temporalImage = jsonResult.name;

                        typeof callback === 'function' && callback(jsonResult);

                }
        }

        ajax.open("POST", URL_SERVER + "upload.php");
        ajax.send(data);
        }
    };
    
    self.showLogo = function(jsonResult) {
        
        var $logoConteiner = $("#conteiner-logo");
        
        $("#event-image").val(jsonResult.name);

        $("#event-image-error").remove();

        $logoConteiner.css("background", "transparent");

        $logoConteiner.html("<img src='" + jsonResult.src + "'/>");
    };
    
    self.removeLogo = function(imageName) {
        return $.ajax({
          url: URL_SERVER + "removeImage.php",
          type: "POST",
          data: {imgname : imageName }
        });
    };
    
    self.showConferences = function() {
        
        var $panelView = $("#panel-view");
        var $addButton = $("#add-button");
        
        $panelView.empty();
        
        $addButton.css("display", "inline");
        
        TweenMax.set($addButton, {clearProps:"all"});
        
        self.upFloatingAnimation($addButton);
            
        $panelView.html(self.templateConferences());

        ko.cleanNode($panelView[0]);

        ko.applyBindings(null, $panelView[0]);

        $('.grid').masonry({
          itemSelector: '.grid-item'
        });

        self.panelViewAnimation($(".grid-item"));
    };
    
    self.updateTheme = function() {
        
        var primaryPosition = $("#event-primary-color").val();
        var accentPosition = $("#event-accent-color").val();
        var primaryColors = COLORS[primaryPosition].colors;
        var accentColors = COLORS[accentPosition].colors;
        
        return $.ajax({
          url: URL_SERVER + "updateTheme.php",
          type: "POST",
          data: { 
              dark : primaryColors[0],
              primary : primaryColors[1],
              light : primaryColors[2],
              text : primaryColors[3],
              ascent : accentColors[0],
              id : self.eventObj.theme.id
          }
        });
    };
    
    self.updateEvent = function() {
        
        var eventData = $("#form-edit-event").serializeArray();

        eventData.push({ name: "idTheme", value: self.eventObj.theme.id });
        eventData.push({ name: "adminid", value: localStorage.getItem("idadmin")});
        eventData.push({ name: "eventid", value: self.eventObj.id});
        eventData.push({ name: "filename", value: self.eventObj.logo});
        
        return $.ajax({
           type: "POST",
           url: URL_SERVER + 'updateEvent.php',
           data: eventData
        });
    };
    
    self.showToast = function(message, srcIcon) {
        
        $("#toast-conteiner").remove();
        
        var template = '<div id="toast-conteiner" class="horizontal-center toast">\
            <span id="toast-text" class="text-color">'+ message +'</span> <img id="toast-icon" src="'+ srcIcon +'" class="vertical-center">\
        </div>';
        
        $("body").append(template);
        
        var $toastConteiner = $("#toast-conteiner");
        var $icon = $("#toast-icon");
        
        TweenMax.set($icon, { scale: 0})
        TweenMax.to($icon, 0.3, { rotation: 360, scale: 1, delay: 0.3, force3D:false, onComplete: function() { TweenMax.set($icon, {rotation: 0});}});
        self.upFloatingAnimation($toastConteiner, function() {
            self.fadeAnimation($toastConteiner, 2);
        });
    };
    
    self.changeView = function(callback) {
        
        var $toast = $("#toast-conteiner");
        
        TweenMax.killTweensOf($toast);
        
        self.downFloatingAnimation($toast, function(){ $toast.remove();});
        
        callback();
    };
    
    
    /* Animations {*/
    
    self.panelViewAnimation = function($child) {
        
        var $body = $("body");
        $body.css("overflow-x","hidden");
        TweenMax.from($child, 0.5, {x: 500, ease: Power3.easeOut});
        TweenMax.from($child, 0.6, {opacity: 0});
    };
    
    self.upFloatingAnimation = function($element, callback) {
        
        TweenMax.from($element, 0.8, { bottom: -50, ease: Elastic.easeOut.config(1, 0.4), onComplete: function() { typeof callback === 'function' && callback(); } });
        
        TweenMax.from($element, 0.6, { opacity: 0});
    };
    
    self.downFloatingAnimation = function($element, callback) {
        TweenMax.to($element, 0.5, { y: 50, ease: Back.easeInOut.config(1.7), onComplete: function() {
            callback();
        } });
        TweenMax.to($element, 0.3, { opacity: 0});
    };
    
    self.fadeAnimation = function($element, delay) {
        TweenMax.to($element, 2, {opacity: 0, delay: delay, onComplete: function(){ $element.remove();}})
    };
    
    self.showWindowAnimation = function($element) {
        TweenMax.from($element, 0.5, {scale: 0.5, ease: Power3.easeOut});
    };
    
    /* } Animations*/
    
    
    
    /* Templates {*/
    
    self.templateConferences = function() {
      return '<style>\
        #conteiner-conferences\
        {\
            margin-bottom: 130px;\
        }\
    </style>\
    <div id="conteiner-conferences" data-bind="foreach: conferences" class="grid">\
            <div class="form-conteiner conferences-conteiner grid-item">\
                <div class="form-title-conteiner">\
                    <h2 data-bind="text: title"></h2>\
                </div>\
                <div class="form-content-conteiner">\
                    <h3 style="text-align: left;" data-bind="text: place"></h3>\
                    <h5 style="text-align: left;" data-bind="text: date"></h5>\
                </div>\
                <div class="form-buttons-conteiner">\
                    <button class="flat-button float-right text-accent">SHOW MORE</button>\
                    <div style="clear:both"></div>\
                </div>\
            </div>\
           </div>';  
    };
    
    self.templateEvent = function () {
        return '<style>\
    #save-form-button\
    {\
        font-size: 20px;\
    }\
</style>\
<div id="form-conteiner-udpate-event" class="form-conteiner form-event">\
    <input type="file" name="file" id="file" style="display: none;"/>\
    <form id="form-edit-event">\
            <div class="form-title-conteiner">\
                <h2>Event Manager</h2>\
            </div>\
            <div class="form-content-conteiner">\
                <div id="conteiner-logo">\
                </div>\
                <div class="label-event-form">\
                    Name\
                </div>\
                <div class="conteiner-inputs-event">\
                    <input id="event-name" type="text" class="text-input" name="name" data-bind="value: eventObj.name" autocomplete="off">\
                </div>\
                <div style="clear: both;" class="label-event-form">\
                    Description\
                </div>\
                <div class="conteiner-inputs-event">\
                    <textarea data-bind="value: eventObj.description" name="description" rows="1" id="event-description" class="text-input" autocomplete="off"></textarea>\
                </div>\
                <div class="label-event-form">\
                    <br>Theme<br>\
                    <input id="event-primary-color" class="text-input" type="text" name="eventPrimaryColor" autocomplete="off" style="display: none;"/>\
                    <input id="event-accent-color" class="text-input" type="text" name="eventAccentColor" autocomplete="off" style="display: none;"/>\
                </div>\
                <div class="conteiner-inputs-event">\
                    <div id="form-colors-conteiner"></div>\
                </div>\
                <div style="clear: both"></div>\
            </div>\
            <div class="form-buttons-conteiner">\
                <button id="save-form-button" type="submit" class="flat-button float-right text-accent">SAVE</button>\
                <div style="clear:both"></div>\
            </div>\
    </form>\
</div>';
    };
    
    self.templateAddConference = function () {
        return '<div id="conteiner-add-conference" style="display:none;" class="form-conteiner conferences-conteiner">\
        <form id="form-add-conference">\
            <div class="form-title-conteiner">\
                <h2>Conference Manager</h2>\
                <h4>Add conference</h4>\
            </div>\
            <div class="form-content-conteiner">\
                <input type="text" name="title" class="text-input" placeholder="Name" autocomplete="off"/>\
                <div class="conteiner-inputs to-left">\
                    <input type="text" name="place" class="text-input with-icons" placeholder="Place" autocomplete="off"/>\
                    <img class="icons-inputs" src="Images/ic_domain_black_24px.svg">\
                </div>\
                <div class="conteiner-inputs to-right">\
                    <input type="text" name="room" class="text-input with-icons" placeholder="Room" autocomplete="off"/>\
                    <img class="icons-inputs" src="Images/ic_place_black_24px.svg">\
                </div>\
                <div class="conteiner-inputs to-left" style="margin-bottom: 10px;">\
                    <input id="conference-date" type="text" name="date" class="text-input with-icons" placeholder="Date" autocomplete="off"/>\
                    <img class="icons-inputs" src="Images/ic_event_black_24px.svg">\
                </div>\
                <div class="conteiner-inputs to-right" style="margin-bottom: 10px;">\
                    <input id="conference-time" type="text" name="time" class="text-input with-icons" placeholder="Time" autocomplete="off"/>\
                    <img class="icons-inputs" src="Images/ic_access_time_black_24px.svg">\
                </div>\
                <div class="labels-form">Type</div>\
                <select type="text" name="type" class="text-input" required>\
                    <option value=""></option>\
                    <option value="Conference">Conference</option>\
                    <option value="Workshop">Workshop</option>\
                </select>\
                <div class="labels-form" style="padding-top: 0px;">Description</div>\
                <textarea name="description" rows="1" id="event-description" class="text-input" autocomplete="off"></textarea>\
                <div style="clear:both"></div>\
            </div>\
            <div class="form-buttons-conteiner">\
                <a id="close-modal" class="flat-button float-right">CANCEL</a>\
                <button type="submit" class="flat-button float-right text-accent">SAVE</button>\
                <div style="clear:both"></div>\
            </div>\
        </form>\
    </div>';
    };
    
    /* } Templates*/

    
    self.showInfo();
    self.getConferences();
    
}

ko.applyBindings(vm);