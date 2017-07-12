'use strict';
window.onload = function() {
    var clientId;
    var screenName;
    var izlEnabled;
    var socket;
    chrome.storage.local.get(["izl_enabled", "izl_screen_name"], function(items) {
        screenName = items.izl_screen_name;
        izlEnabled = items.izl_enabled;

        socket = initialise_comms();
        function pushMessage(type, message) {
            socket.emit(type,  message);
        }

        if(izlEnabled == true) {
            setTimeout(izleminate, 100);
        }
        window.addEventListener("message", function(playerEvent) {
            if (playerEvent.origin != 'http://dizimag2.co' || playerEvent.data.type != 'izl_page') {
                return;
            }

            var data = playerEvent.data;
            switch(data.action) {
                case "pausePlayer":
                    pushMessage('system-control', {
                        action: playerEvent.data.action,
                    });
                    appendMessage('You have paused the player', 'system', 'System');
                    break;
                case "startPlayer":
                    pushMessage('system-control', {
                        action:   playerEvent.data.action,
                        position: playerEvent.data.position
                    });
                    appendMessage('You have started the player', 'system', 'System');
                    break;

                case "seekPlayer":
                    pushMessage('system-control', {
                        action:   playerEvent.data.action,
                        position: playerEvent.data.position
                    });
                    appendMessage('You have moved the player to ' + playerEvent.data.position, 'system', 'System');
                    break;
            }
        });
    });

    function izleminate() {
        $('#player_media').css({
            'width': '80%',
            'float': 'left'
        });

        $('#player').addClass('izl_izleminated');
        $('#player_media').after("<div id='izl-cw'><div id='chat-history'></div><textarea id='chatbox' rows='3'/></div>");

        injectJs();

        $('#chatbox').keydown(function(e){
            if(e.keyCode == 13) {
                var message = $(this).val();
                $(this).val('');
                socket.emit('message',  message);
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
            clientId    = _clientId;
            appendMessage("Hello " + screenName + "! You are the first to join.", 'system', 'System');
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

        socket.on('system-control', function(message, screenName) {
            switch(message.action) {
                case "pausePlayer":
                    messageToPlayer({
                        action: message.action
                    });
                    appendMessage(screenName + ' has paused the player', 'system', 'System');
                    break;
                case "startPlayer":
                    messageToPlayer({
                        action:   message.action,
                        position: message.position
                    });
                    appendMessage(screenName + ' has started the player', 'system', 'System');
                    break;

                case "seekPlayer":
                    messageToPlayer({
                        action:   message.action,
                        position: message.position
                    });
                    appendMessage(screenName + ' has moved the player to' + message.position, 'system', 'System');
                    break;
            }
        });

        return socket;
    }

    function appendMessage(message, owner, screenName) {
        $('#chat-history').append( '<p class="chat-item owner-' + owner + '"><span class="screen-name">' + screenName + ':</span>' + message + '</p>');
    }

    function messageToPlayer(message) {
        Object.assign(message, { type: 'izl_plugin' });
        window.postMessage(message, "http://dizimag2.co/*");
    }

    function injectJs() {
        var classIncluder    = document.createElement('script');
        classIncluder.src    = chrome.extension.getURL('scripts/JWPlayerWrapper.js');
        classIncluder.onload = function() {
            var script = document.createElement('script');
            script.src = chrome.extension.getURL('scripts/dizimag.js');
            document.body.appendChild(script);
        }
        document.body.appendChild(classIncluder);
    }
};
