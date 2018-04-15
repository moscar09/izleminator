"use strict";

require('./playerWrappers/cadmium-player-wrapper.js');
require('./playerWrappers/test-player-wrapper.js');
require('./playerWrappers/video-js-wrapper.js');

var izl_communicator = class {
    constructor() {
        var self = this;
        window.addEventListener("message", function(playerEvent) {
            if (playerEvent.data.type != 'izl_plugin') {
                return;
            }

            self._maybeCallOnMessageCallback(playerEvent);
        });
    }

    _maybeCallOnMessageCallback(playerEvent) {
        this.onMessageCallback(playerEvent);
    }

    set onMessage(onMessageCallback) {
        this.onMessageCallback = onMessageCallback;
    }

    postMessage(action, extraData) {
        var defaultData = {
            action: action,
            type: 'izl_page',
        };

        if(extraData) {
            Object.assign(defaultData, extraData);
        }

        window.postMessage(defaultData, '*');
    }
}

var playerClass  = getPlayerClass(window.location.host);
var Izl_pl = new playerClass(new izl_communicator());

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