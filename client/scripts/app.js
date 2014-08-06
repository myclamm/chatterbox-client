// YOUR CODE HERE:
var app = {};
$(document).ready(function(){

	app.server = 'https://api.parse.com/1/classes/chatterbox';
	app.username = window.location.href.split("=")[1];
	app.room = "lobby";
	app.friends = {};
	app.rooms = {};

	//invokes app.fetch and passes callback that appends all messages to the dom
	app.init = function(){
		setInterval(function(){app.fetch.call(null,app.appendAllToDom)},500);
		setInterval(function(){app.fetch.call(null,app.updateRooms)},500);
	};

	//takes data from server, adds new rooms to app.rooms and dropdown menu
	app.updateRooms = function(messages){
		messages.results.forEach(function(message){
			if(!(message.roomname in app.rooms)){
				//adds to app.room
				app.rooms[_.escape(message.roomname)]=true;
				//adds to dropdown menu
				app.addRoom(message.roomname);
				//creates a new div
			}
		});
	};

	app.send = function(message){
		$.ajax({
			url: app.server,
			type: 'POST',
			data: JSON.stringify(message),
			contentType: 'application/json',
			success: function(){console.log ('message sent')},
			error: function(){console.log('error, message send failed')}
		})
	};

	//tool that empties chats and then appends the newest 15 messages of an object to #chats
	app.appendAllToDom = function(messages){
		$('#chats').empty();
		var data = messages.results;
		for(var i=0;i<15;i++){
			app.appendMessageToDom(data[i]);
		}
	};

	//tool that appends a single message to #chats
	app.appendMessageToDom = function(message){
		var user = $("<span id='user'></span>").text(_.escape(message.username));
		var text = _.escape(message.text);
		var newMessage = $('<div></div>').append(user).append(": "+text);
		
		//makes messages bold if message is from friend
		if(message.username in app.friends){
			newMessage.attr('id','friend')
			newMessage.css("font-weight","bold")
		}

		
		$("#chats").append(newMessage);
	};

	//fetches data from server and invokes callback on data
	app.fetch = function(callBack){
		$.ajax({
			url: app.server,
			type: 'GET',
			data: {order: '-createdAt'},
			contentType: 'application/json',
			success: function(data){
				callBack(data)},
			error: function(){console.log('error')}
		});
	};

	app.clearMessages = function(){
		$("#chats").html('')
	};

	app.addMessage = function(message){
		var text = message.text;
		var newDiv = $('<div></div>').text(text); 
		$("#chats").append(newDiv);
	};
	//look into this
	app.addRoom = function(roomName){
		var newRoom = $('<option></option>').text(roomName);
		$("#roomSelect").append(newRoom);
	};

	app.handleSubmit = function(){
		var textToSend = $("#send").val();
		var newMessage = {
			username: app.username,
			text: textToSend,
			roomname: app.room
		};
		app.send(newMessage);
	};

//stuff that happens when page loads
	app.init();
	//sends message when submit button clicked
	$("button").on('click',function(){
		console.log('hi')
		app.handleSubmit();
	});
		//adds username to app.friends when clicked
	$("div").on('click','span',function(){
		console.log('user clicked');
		app.friends[$(this).text()]=true;
	});
	//makes messages from friends bold
	$("div#friend").css("font-weight","bold")
	//makes usernames bold on mouseovers
	$("div").on('mouseover','span',function(){
		$(this).css("font-weight","bold");
	});
	$("div").on('mouseout','span',function(){
		$(this).css("font-weight","normal");
	});
	//changes app.room when dropdown menu is used
	$('select').on('change',function(){
		var room = $(this).find(":selected").val();
		app.room = room;
	})
});


