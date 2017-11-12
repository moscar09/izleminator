'use strict';

var screenName;
var izlEnabled;

chrome.storage.local.get(["izl_enabled", "izl_screen_name"], function(items) {
    screenName = items.izl_screen_name;
    izlEnabled = items.izl_enabled;

    console.log("wolo");
    if (izlEnabled != true) {
        return;
    }

    var roomname  = "test737";
    var izleminatorClient = new IzleminatorClient({
        websocketUri: socketUri,
        roomname:     roomname,
        username:     screenName
    });

    var playerClass  = TestPlayerWrapper;

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

        // switch(data.action) {

            // case "pausePlayer":
            //     pushMessage('system-control', {
            //         action: playerEvent.data.action,
            //     });
            //     appendMessage('You have paused the player', 'system', 'System');
            //     break;
            // case "startPlayer":
            //     pushMessage('system-control', {
            //         action:   playerEvent.data.action,
            //         position: playerEvent.data.position
            //     });
            //     appendMessage('You have started the player', 'system', 'System');
            //     break;

            // case "seekPlayer":
            //     pushMessage('system-control', {
            //         action:   playerEvent.data.action,
            //         position: playerEvent.data.position
            //     });
            //     appendMessage('You have moved the player to ' + playerEvent.data.position, 'system', 'System');
            //     break;
        // }
    });


    injectJs(playerClass);
});

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
