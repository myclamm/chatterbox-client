// YOUR CODE HERE:
var username = prompt('Please choose a username');
var room = 'lobby'
var app = {
  init: function(){
    $.ajax({
      url: this.server,
      contentType: 'application/json',
      type: 'GET',
      success: function(data){
        app.clearMessages();
        _.each(data.results,function(message){
          app.addMessage(message);
        }) ;
      },
      error: function(){console.log('Failed to receive message')}
    });
  },
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
  fetch: function(){
    var result;
    $.ajax({
      url: this.server,
      contentType: 'application/json',
      type: 'GET',
      success: function(data){
        console.log(data.results);
      },
      error: function(){console.log('Failed to receive message')}
    });
    return result;
  },
  server:'https://api.parse.com/1/classes/chatterbox',
  clearMessages: function(){
    $('#chats').empty();
  },
  addMessage: function(message){
    // create li element
    var $newItem = $("<li></li>");
    // get data from message
    // put data inside li
    $($newItem).append('<div class="username">'+message.username+'</div');
    $($newItem).append('<div class="msg">'+message.text+'</div');
    $($newItem).append('<div class="room">'+message.roomname+'</div');
    // append li to list
    $('#chats').append($newItem);
  },
  addRoom: function(roomName){
    //create an html object
    var $newRoom = $('<option></option>');
    $($newRoom).text(roomName);
    //insert into roomselect
    $('#roomSelect').append($newRoom);
  },
  addFriend: function(userName){
    //add a class of friend to every username
    //that matches the argument
  },
  handleSubmit: function(input){
    var myMessage = {
      username: username,
      room: room,
      text: input
    };
    app.send(myMessage);
  }
};
$(document).ready(function(){
  $('.submit').on('submit',function(e){
    e.preventDefault();
    var $message = $('#message');
    app.handleSubmit($($message).val());
    $($message).val('');
  });

  $('div').on('click','.username', function(){
    app.addFriend($(this).text());
  });
  //setInterval(app.init.bind(app),5000);
});

