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

    window.addEventListener("message", function(playerEvent) {
        if (playerEvent.data.type != 'izl_page') {
            return;
        }

        var data = playerEvent.data;
        izleminatorClient.sendMessage(data.action, IzleminatorClient.MessageTypeEnum.CONTROL);
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
            console.log("returning tpw");
            return TestPlayerWrapper;
        case "www.netflix.com":
            console.log("returning cpw");
            return CadmiumPlayerWrapper;
    }

}


