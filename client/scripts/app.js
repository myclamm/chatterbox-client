// YOUR CODE HERE:
var app = {
  //config.js automatically prompts for a username and appends it to the URL, so we grab it off the url
  username : document.URL.split('=')[1],
  //default room is lobby
  room : 'lobby',
  //if totalMsgs is >100, app.addMessage switches from append to prepend
  totalMsgs: 0,
  //if lastMsg is null, app.addMessage appends the newest 100 tweets, after that,
  //it will prepend all tweets, and iterate over the server's data array backwards starting from lastMsg-1
  lastMsg: null,

  //initializes page with 100 tweets, sets click handler on submit button,
  //sets addFriend functionality, and calls fetch every 1 second
  init: function(){
    app.fetch();
    $('.submit').on('click',function(event){
      event.preventDefault();
      var $message = $('#message');
      app.handleSubmit($($message).val());
      $($message).val('');
    });

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
        //for the first 100 tweets it iterates in order and calls addMessage to append them to the chatbox
        //so that the newest tweets are at the top (the array is in order from newest to oldest)
        if(app.lastMsg === null){
          _.each(data.results,function(message){
            app.addMessage(message);
          }) ;
        } else {
          //if 100 tweets have been posted (i.e. we've called init already), all subsequent
          //setInterval calls of fetch will iterate through the server data backwards, starting from
          //the last message that was posted, and working to index 0. app.addMessage will automatically
          //remove old posts as it prepends new ones.
          for(var k = 0; k < data.results.length; k++){
            if(app.lastMsg === data.results[k].objectId){
              for(var i = k-1; i >= 0;i--){
                app.addMessage(data.results[i]);
              }
            }
          }
        }
      },
      error: function(){console.log('Failed to receive message')}
    });
    return result;
  },

  //defines the server URL
  server:'https://api.parse.com/1/classes/chatterbox',

  //clears the chat box
  clearMessages: function(){
    $('#chats').empty();
  },

  //takes a message object and appends it to #chats for the first 100 messages,
  //otherwise it prepends it to #chats and removes an old message from the bottom
  addMessage: function(message){
    app.lastMsg = message.objectId;
    var $newItem = $("<li></li>");
    $($newItem).append('<div class="username">'+message.username+":"+'</div');
    $($newItem).append('<div class="msg">'+" "+message.text+'</div');
    if(app.totalMsgs < 100){
      $('#chats').append($newItem);
      app.totalMsgs++;
    } else {
      $('#chats').prepend($newItem);
      $('li:last-child').remove();
    }
  },

  //Currently, this just adds roomNames to the #roomSelect dropdown menu
  addRoom: function(roomName){
    var $newRoom = $('<option></option>');
    $($newRoom).text(roomName);
    $('#roomSelect').append($newRoom);
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
  }
};

//When document loads, call app.init()
$(document).ready(function(){
  app.init();
});


