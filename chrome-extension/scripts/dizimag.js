'use strict';

var player = new JWPlayerWrapper(window.jwplayer);
var latestAction;
var justDidSeek;
var allowedSources = {
    "http://dizimag2.co": true,
    "http://dizimag3.co": true,
};
window.jwplayer().onPause(function() {
    console.log("onpause");
    izl_postMessage('pausePlayer');
});

window.jwplayer().onPlay(function() {
    console.log("onplay");
    if(justDidSeek > 0) {
        justDidSeek--;
        return;
    }

    console.log("onplay unskipped");
    var position = window.jwplayer().getPosition();
    izl_postMessage('seekPlayer', {position: position});
});

window.jwplayer().onSeek(function(position) {
    console.log("onseek");
    justDidSeek = 2;
    izl_postMessage('seekPlayer', {position: position.offset});
});

window.addEventListener('message', function(playerEvent) {
    if (!allowedSources[playerEvent.origin] || playerEvent.data.type != 'izl_plugin') {
        return;
    }

    var data = playerEvent.data;

    latestAction = data.action;

    console.log("Received action");
    console.dir(data);


    switch(data.action) {
        case "pausePlayer":
            player.pause();
            break;
        case "seekPlayer":
            player.seek(data.position);
            player.start();
            break;
    }

});

function izl_postMessage(action, extraData) {
    if (latestAction == action) {
        return;
    }

    console.log("Sending action " + action);
    var defaultData = {
        action: action,
        type: 'izl_page',
    };

    if(extraData) {
        Object.assign(defaultData, extraData);
    }

    console.dir(defaultData);
    window.postMessage(defaultData, '*');
}
