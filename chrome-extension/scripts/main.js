$(document).ready(function() {
    var clientId;
    var screenName;

    chrome.storage.local.get(["izl_enabled", "izl_screen_name"], function(items) {
      screenName = items.izl_screen_name;
      if(items.izl_enabled == true) {
        setTimeout(izleminate, 100);
      }
    });

    function izleminate() {
      $('#player_media').css({
          'width': '80%',
          'float': 'left'
      });
      $('#player_media').after("<div id='izl-cw'><div id='chat-history'></div><textarea id='chatbox' rows='3'/></div>");

      socket = initialise_comms();

      $('#chatbox').keydown(function(e){
          if(e.keyCode == 13) {
              var message = $(this).val();
              $(this).val('');
              socket.emit( 'message',  message);
              appendMessage(message, 'user', screenName);
              e.preventDefault();
          }
      e.stopPropagation();
      });
    }

    function initialise_comms() {
        var isInitiator;

        window.room = 'test737';

        var socket = io.connect(connectUrl);

        if (room !== "") {
          console.log('Message from client: Asking to join room ' + room);
          socket.emit('create or join', {
            'room'      : room,
            'screenName': screenName,
            'secret'    : key
          });
        }

        socket.on('created', function(room, _clientId) {
          isInitiator = true;
          clientId = _clientId;
          appendMessage("Hello " + screenName + "! You are the first to join.", 'system', 'System');
        });

        socket.on('full', function(room) {
          console.log('Message from client: Room ' + room + ' is full :^(');
        });

        socket.on('ipaddr', function(ipaddr) {
          console.log('Message from client: Server IP address is ' + ipaddr);
        });

        socket.on('joined', function(room, _clientId) {
          isInitiator = false;
          clientId = _clientId;
          appendMessage("Hello " + screenName + "! There are already people here.", 'system', 'System');
        });

        socket.on('join', function(room, screenName) {
          appendMessage(screenName + " joined the chat.", 'system', 'System');
        });

        socket.on('message', function(message, screenName) {
            appendMessage(message, 'world', screenName);
        });

        socket.on('log', function(array) {
          console.log.apply(console, array);
        });

        return socket;
    }


    function appendMessage(message, owner, screenName) {
        $('#chat-history').append( '<p class="chat-item owner-' + owner + '"><span class="screen-name">' + screenName + ':</span>' + message + '</p>');
    }
});
