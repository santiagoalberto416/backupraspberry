var URL_SERVER = "http://localhost/croissant/"

$("document").ready(function(){
    
   $.ajax({
               type: "GET",
               url: URL_SERVER + 'getEvent.php',
               data: {id : localStorage.getItem("idevent")}
    }).done(function(data){
       
       console.log(data);
       var jsonResult = JSON.parse(data);
       var theme = jsonResult.theme;
       
       console.log(theme);
       var path = window.location.pathname;
       console.log(path + " path");
       
       $("#event-name").html(jsonResult.name);
       $("#event-logo").append('<img src="upload/'+ jsonResult.logo +'" />');
       
       var style = '#header { background: '+ theme.primary_dark +';}\
            #content-menu { background: '+ theme.primary +';}\
            .button-options-askqstns { background: '+ theme.primary +';}\
            #moderator-name { color: '+ theme.icons +' }\
            #conference-title { color: gray;}\
            #text-logout { color: '+ theme.icons+'}\
            #title-Conference { color: gray;}\
            #place-Conference { color: gray;}\
            .text-headerquestion { color: '+ theme.primary+';}\
            .sent { color: '+ theme.ascent+'; border: 1px solid '+ theme.ascent+'}\
            .cancel { color: '+ theme.primary +'; border: 1px solid '+ theme.primary+'}\
            #confT { color: gray;}\
            #placeC { color: gray;}\
            #date { color: gray;}\
            #time { color: gray;}\
            .td-info-conference { color: '+ theme.icons+' }\
            #name-speaker { color: '+ theme.icons+'}\
            .td-title { color: ' + theme.icons+ '}\
            .question-triangle { display: none;}\
            #question-sent { background: '+ theme.primary_light +';}\
            #info-Conference { color: gray;}\
            .button-options { background: '+ theme.primary +'; color: '+ theme.icons+';}\
            .edit { background: '+ theme.primary +'}\
            #btn-add-question { background: '+ theme.primary +'}\
            .more { background: '+ theme.ascent +'}\
            #question-hold { background: '+ theme.primary_light +'}\
            .tabs { background: '+ theme.primary_light +'}\
            #button-back { background: '+ theme.ascent +'}\
            #div-buttons button { background: '+ theme.primary +'; color: '+ theme.icons+';}\
            #h1 { color: gray; }';
            
       
            if(path !== '/conferences.html' && path !== '/conferences-moderator.html' && path !== '/conferences-speaker.html') style += ' #name-speaker { color: gray;} ';
            if(path !== '/conference.html' && path !== '/ask_question.html' && path !== '/activity_conference.html' && path !== '/moderator.html' && path !== "/managequestions.html" && path !== '/create-trivia.html' && path !== '/speaker.html' && path !== '/scores.html') style += ' .table-conference { background: '+ theme.primary +'}';
       
        style += ' #div-logout { border-left: 1px solid '+ theme.icons +'}';
       
       $("head").append("<style id='dynamicStylesheet'></style>");
       $("#dynamicStylesheet").text(style);
       
   });
    
});
