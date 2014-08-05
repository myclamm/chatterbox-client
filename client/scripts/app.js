// YOUR CODE HERE:
var app = {
  username : document.URL.split('=')[1],
  room : 'lobby',
  totalMsgs: 0,
  lastMsg: null,
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
      data:'order=-createdAt',
      contentType: 'application/json',
      type: 'GET',
      success: function(data){
        if(app.lastMsg === null){
          _.each(data.results,function(message){
            app.addMessage(message);
          }) ;
        } else {
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
  server:'https://api.parse.com/1/classes/chatterbox',
  clearMessages: function(){
    $('#chats').empty();
  },
  addMessage: function(message){
    app.lastMsg = message.objectId;
    // create li element
    var $newItem = $("<li></li>");
    // get data from message
    // put data inside li
    $($newItem).append('<div class="username">'+message.username+'</div');
    $($newItem).append('<div class="msg">'+message.text+'</div');
    // append li to list
    if(app.totalMsgs < 100){
      $('#chats').append($newItem);
      app.totalMsgs++;
    } else {
      $('#chats').prepend($newItem);
      $('li:last-child').remove();
    }
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
      username: this.username,
      room: this.room,
      text: input
    };
    app.send(myMessage);
  }
};
$(document).ready(function(){
  app.init();
});


