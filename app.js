var express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server),
	nicknames = {};
	
	//server.listen(process.env.PORT, process.env.IP);
	server.listen(8081);
	app.use(express.static('web'));

	
	app.get('/', function(req, res){
		res.sendfile(__dirname + '/web/index.html');
		//res.render('moderator.html');
	});

	
	//SOCKETS
	io.sockets.on('connection', function(socket){
		
		socket.on('chat message', function(msg){
			
			    io.emit('chat message', msg);
			  });
	   io.on('connection', function(socket){
		  socket.on('chat message', function(msg){
		    console.log('message: ' + msg);
		  });
		});
	
	  	socket.on('removeAction', function(data){
				console.log('REMOVER');
				io.sockets.emit('removeScreen', data);
			});
	
	    socket.on('uploadDataGraphic', function(data){
	      console.log('uploadDataGraphic');
	      io.sockets.emit('uploadDataGraphic', data);
	    });
	    
	    socket.on('disconnect', function(data){
			console.log('one user disconnected '+socket.id);
		});
		
		
		socket.on('showUserImage', function(data){
			console.log('show image');
			io.sockets.emit('showImage', data);
		});
	    
    
	});