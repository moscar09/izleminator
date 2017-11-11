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


});
