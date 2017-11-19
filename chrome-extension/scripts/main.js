'use strict';

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
        websocketUri: socketUri,
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
                izleminatorClient.sendMessage(data.action + ":" + data.position, IzleminatorClient.MessageTypeEnum.CONTROL);
                break;
            default:
                izleminatorClient.sendMessage(data.action, IzleminatorClient.MessageTypeEnum.CONTROL);
                break;            
        }
    });


    injectJs(playerClass);

}

function injectJs(playerClass) {
    var jqIncluder    = document.createElement('script');
    jqIncluder.src    = chrome.extension.getURL('scripts/lib/jquery.min.js');
    jqIncluder.onload = function() {
        var classIncluder    = document.createElement('script');
        classIncluder.src    = chrome.extension.getURL('scripts/playerWrappers/' + playerClass.includeFilename);
        classIncluder.onload = function() {
            var script = document.createElement('script');
            script.src = chrome.extension.getURL('scripts/inlined.js');
            document.body.appendChild(script);
        }
        document.body.appendChild(classIncluder);
    }
    document.body.appendChild(jqIncluder);
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
            data.action   = "seekPlayer";
            data.position = controlParams[1];
            break;
        default:
            data.action = controlParams[0];
            break;
    }

    window.postMessage(data, '*');
}