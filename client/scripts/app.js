// YOUR CODE HERE:
var app = {
  //config.js automatically prompts for a username and appends it to the URL, so we grab it off the url
  username : document.URL.split('=')[1],
  //default room is lobby
  room : 'lobby',
  //if lastMsg is null, app.addMessage appends the newest 100 tweets, after that,
  //it will prepend all tweets, and iterate over the server's data array backwards starting from lastMsg-1
  lastMsg: null,
  //stores roomNames
  rooms:{},

  //initializes page with 100 tweets, sets click handler on submit button,
  //sets addFriend functionality, and calls fetch every 1 second
  init: function(){
    app.fetch();
    $('.submit').on('click',function(){
      event.preventDefault();
      var $message = $('#message');
      app.handleSubmit($($message).val());
      $($message).val('');
    });
    //applies changeRoom() to any room selected in dropdown menu
    $('select').on('change',function(){
      var temp = $(this).find(":selected").val();
      app.room = temp
      app.changeRoom(temp);
    })

    $('div').on('click','.username', function(){
      app.addFriend($(this).text());
    });

    setInterval(app.fetch.bind(app),1000);
  },

  //JSONstringifies a message and posts it to the server. Gets called by handleSubmit
  //when the submit button is clicked
  send: function(message){
    $.ajax({
      url: this.server,
      contentType: 'application/json',
      type: 'POST',
      data: JSON.stringify(message),
      success: function(){console.log('message sent')},
      error: function(){console.log('failed to send message')}
    })
  },

  //Gets data from server, calls addMessage on every element of the data array.
  fetch: function(){
    var result;
    $.ajax({
      url: this.server,
      data:'order=-createdAt',
      contentType: 'application/json',
      type: 'GET',
      success: function(data){
        //the first time fetch gets called, set app.lastMsg to be the last message
        //in the data array
        if(app.lastMsg === null){
          app.addMessage(data.results[data.results.length-1]);
        } else {
          //iterates over the data until it finds the last message
          //at which point it iterates backwards from there and
          //calls addMessage for each message
          for(var k = 0; k < data.results.length; k++){
            if(app.lastMsg === data.results[k].objectId){
              for(var i = k-1; i >= 0;i--){
                app.addMessage(data.results[i]);
              }
              break;
            }
          }
        }
      },
      error: function(){console.log('Failed to receive message')}
    });
    return result;
  },

  //defines the server URL
  server:'https://api.parse.com/1/classes/chatterbox?',

  //clears the chat box
  clearMessages: function(){
    $('#chats').empty();
  },

  //takes a message object and appends it to #chats for the first 100 messages,
  //otherwise it prepends it to #chats and removes an old message from the bottom
  addMessage: function(message){
    app.lastMsg = message.objectId;
    //create element to be inserted
    var $newItem = $("<li></li>");
    $($newItem).append('<div class="username">'+_.escape(message.username)+':</div');
    $($newItem).append('<div class="msg"> '+_.escape(message.text)+'</div');
    //refactor function and add else statement
    if(!app.rooms[message.roomname]){
      app.addRoom(message.roomname);
    }
    app.rooms[message.roomname].prepend($newItem);
  },

  //Adds rooms to the dropdown menu and appends rooms to DOM,
  addRoom: function(roomName){
    var $newRoom = $('<option></option>');
    $($newRoom).text(_.escape(roomName));
    $('#roomSelect').append($newRoom);
    app.rooms[roomName] = $('<ul class="inactive '+roomName+' "></ul>');
    $('#chats').append(app.rooms[roomName]);
  },
  changeRoom: function(roomName){
    console.log('hi')
    $('ul').addClass('inactive');
    app.rooms[roomName].removeClass('inactive');
  },
  //We have yet to implement this function
  addFriend: function(userName){
    //add a class of friend to every username
    //that matches the argument
  },

  //Packages the input in the tweet form into an object with username and room,
  //and then posts the message to the server via app.send
  handleSubmit: function(input){
    var myMessage = {
      username: this.username,
      room: this.room,
      text: input
    };
    app.send(myMessage);
  },

};

//When document loads, call app.init()
$(document).ready(function(){
  app.init();
});


