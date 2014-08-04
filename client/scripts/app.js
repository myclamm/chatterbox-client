// YOUR CODE HERE:
var app = {
  init: function(){},
  send: function(message){
    $.ajax({
      url: 'https://api.parse.com/1/classes/chatterbox',
      contentType: 'application/json',
      type: 'POST',
      data: JSON.stringify(message),
      success: function(){console.log('message sent')},
      error: function(){console.log('failed to send message')}
    })
  },
  fetch: function(){
    $.ajax({
      url: this.server,
      contentType: 'application/json',
      type: 'GET',
      success: function(data){console.dir(data)},
      error: function(){console.log('Failed to receive message')}
    });
  },
  server:'https://api.parse.com/1/classes/chatterbox'
};


