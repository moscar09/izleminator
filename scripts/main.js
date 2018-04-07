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
            iframe_url.searchParams.set("izl_room", roomname);
            iframe.src = iframe_url.toString();
        }
    }

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

    izleminatorClient.onOpen    = function(e) { chatWindow.onOpenCallback(e, chatWindow); }
    izleminatorClient.onClose   = function(e) { chatWindow.onCloseCallback(e, chatWindow); }
    izleminatorClient.onError   = function(e) { chatWindow.onErrorCallback(e, chatWindow); }
    izleminatorClient.onMessage = function(e) {
        chatWindow.onMessageCallback(e);
        var message = JSON.parse(event.data);
        if (message.messageType != IzleminatorClient.MessageTypeEnum.CONTROL) return;
        if (message.fromUuid == chatWindow.fromUuid ) return;

        sendToContent(message);
    }

    izleminatorClient.open();

    window.addEventListener("message", function(playerEvent) {
        if (playerEvent.data.type != 'izl_page') {
            return;
        }

        var data = playerEvent.data;
        switch(data.action) {
            case "seekPlayer":
            case "seekAndStartPlayer":
                izleminatorClient.sendMessage(data.action + ":" + data.position, IzleminatorClient.MessageTypeEnum.CONTROL);
                break;
            case "pausePlayer":
                izleminatorClient.sendMessage(data.action, IzleminatorClient.MessageTypeEnum.CONTROL);
                break;
            case "heartbeat":
            izleminatorClient.heartBeat(data.position);
                break;
        }
    });

    injectJs(playerClass);

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