'use strict';

window.$ = window.jQuery = require("jquery");
require("./izleminator-client.js");
require("./izleminator-chat.js");
require ('./playerWrappers/cadmium-player-wrapper.js');
require('./playerWrappers/test-player-wrapper.js');

var screenName;
var izlEnabled;

chrome.storage.local.get(["izl_enabled", "izl_screen_name"], function(items) {
    screenName = items.izl_screen_name;
    izlEnabled = items.izl_enabled;

    if (izlEnabled != true) {
        return;
    }

    var playerClass  = getPlayerClass(window.location.host);
    window.playerClass = playerClass;

    checkIsContextReady(playerClass);
});

function checkIsContextReady(playerClass) {
    if(playerClass.isContextReady()) {
        initializeContent(playerClass);        
    } else {
        setTimeout( function() { checkIsContextReady(playerClass) }, 500 );
    }
}

function initializeContent(playerClass) {
    var roomname  = "test737";
    var izleminatorClient = new IzleminatorClient({
        websocketUri: SOCKET_URI,
        roomname:     roomname,
        username:     screenName
    });


    var chatWindow = new IzleminatorChat({
        playerMedia:   playerClass.playerMedia,
        playerWrapper: playerClass.playerWrapper,
        chatClient:    izleminatorClient
    });

    izleminatorClient.onOpen    = function(e) { chatWindow.onOpenCallback(e, chatWindow); }
    izleminatorClient.onClose   = function(e) { chatWindow.onCloseCallback(e, chatWindow); }
    izleminatorClient.onError   = function(e) { chatWindow.onErrorCallback(e, chatWindow); }
    izleminatorClient.onMessage = function(e) { 
        chatWindow.onMessageCallback(e, chatWindow);
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