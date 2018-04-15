'use strict';

require("./izleminator-client.js");
require("./izleminator-chat.js");
require ('./playerWrappers/cadmium-player-wrapper.js');
require('./playerWrappers/test-player-wrapper.js');
require ('./playerWrappers/video-js-wrapper.js');

var screenName;
var roomname;
var checksDone = 0;

var url = new URL(window.location.toString());

if(url.searchParams.get("izl_room") != undefined) {
    roomname = url.searchParams.get("izl_room");
    if (window === top ) {
        var iframes = document.getElementsByTagName('iframe');
        for (var i = 0; i < iframes.length; i++) {
            var iframe = iframes[i];
            var iframe_url = new URL(iframe.src);

            if(iframe_url.hash == "") {
                iframe_url.hash = `izl_room=${roomname}`;
            } else {
                iframe_url.hash += `|#izl_room=${roomname}`;
            }

            iframe.src = iframe_url.toString();
        }
    }

    chrome.storage.local.get(["izl_screen_name"], function(items) {
        initialize({screenName: items.izl_screen_name });
    });
} else if (url.hash.match(/izl_room=([a-zA-Z0-9]+)$/gm) && window !== top ) {
    var regex = RegExp('izl_room=([a-zA-Z0-9]+)$', 'gm');
    roomname = regex.exec(url.hash)[1];
    console.log("roomname: " + roomname);
    chrome.storage.local.get(["izl_screen_name"], function(items) {
        initialize({screenName: items.izl_screen_name });
    });
} else {
    chrome.runtime.onMessage.addListener( function(request, sender, sendResponse) {
        if (request.izleminate != true || chrome.runtime.id != sender.id) {
            return;
        }

        roomname = request.room_name;
        initialize({screenName: request.screen_name });
    });
}

function initialize(args) {
    screenName = args.screenName;
    var playerClass = getPlayerClass(window.location.host);
    if (playerClass == undefined) {
        return;
    }
    window.playerClass = playerClass;

    checkIsContextReady(playerClass);
}

function checkIsContextReady(playerClass) {
    checksDone++;
    if(playerClass.isContextReady()) {
        initializeContent(playerClass);
    } else {
        if(checksDone < 50) {
            setTimeout( function() { checkIsContextReady(playerClass) }, 500 );
        }
    }
}

function initializeContent(playerClass) {
    var izleminatorClient = new IzleminatorClient({
        websocketUri: SOCKET_URI,
        roomname:     roomname,
        username:     screenName
    });


    var chatWindow = new IzleminatorChat({
        playerClass:   playerClass,
        chatClient:    izleminatorClient
    });

    izleminatorClient.onOpen    = function(e) { chatWindow.onOpenCallback(e); }
    izleminatorClient.onClose   = function(e) { chatWindow.onCloseCallback(e); }
    izleminatorClient.onError   = function(e) { chatWindow.onErrorCallback(e); }
    izleminatorClient.onMessage = function(e) {
        chatWindow.onMessageCallback(e);
        var message = JSON.parse(e.data);
        if (message.messageType != IzleminatorClient.MessageTypeEnum.CONTROL) return;
        if (message.fromUuid == chatWindow.userUuid ) return;

        sendToContent(message);
    }

    injectJs(playerClass);
    izleminatorClient.open();

    window.addEventListener("message", function(playerEvent) {
        if (playerEvent.data.type != 'izl_page') {
            return;
        }

        var data = playerEvent.data;
        switch(data.action) {
            case "seekPlayer":
            case "seekAndStartPlayer":
                izleminatorClient.sendMessage(
                    data.action + ":" + data.position,
                    IzleminatorClient.MessageTypeEnum.CONTROL,
                    {
                        action: data.action,
                        position: String(data.position),
                        version: "1",
                    }
                );
                break;
            case "pausePlayer":
                izleminatorClient.sendMessage(
                    data.action,
                    IzleminatorClient.MessageTypeEnum.CONTROL,
                    {
                        version: "1",
                        action: data.action,
                    }
                );
                break;
            case "nextEpisode":
                izleminatorClient.sendMessage(data.action,
                    IzleminatorClient.MessageTypeEnum.CONTROL,
                    {
                        version: "1",
                        action: data.action,
                        episode_id: data.episode_id,
                    }
                );
                break;
            case "heartbeat":
                izleminatorClient.heartBeat(data.position);
                break;
        }
    });
}

function injectJs(playerClass) {
    var scriptIncluder    = document.createElement('script');
    scriptIncluder.src    = chrome.extension.getURL('scripts/inlined-bundle.js');
    document.body.appendChild(scriptIncluder);
}

function getPlayerClass(host) {
    switch (host) {
        case "tatooine.moscar.ro":
            return TestPlayerWrapper;
        case "www.netflix.com":
            return CadmiumPlayerWrapper;
        case "uptostream.com": case "720pizle.com":
            return VideoJsWrapper;
        default:
            return VideoJsWrapper;
    }
}

function sendToContent(message) {
    var controlParams   = message.content.split(':');
    var data = {
        type: 'izl_plugin',
    };

    switch(controlParams[0]) {
        case "seekPlayer":
        case "seekAndStartPlayer":
            data.action   = controlParams[0];
            data.position = controlParams[1];
            break;
        default:
            data.action   = controlParams[0];
            break;
    }
    window.postMessage(data, '*');
}