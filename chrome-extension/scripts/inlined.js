"use strict";

var izl_communicator = class {
    constructor() {
        var self = this;
        window.addEventListener("message", function(playerEvent) {
            if (playerEvent.data.type != 'izl_plugin') {
                return;
            }

            console.dir(playerEvent.data);

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
new playerClass(new izl_communicator());    

function getPlayerClass(host) {
    switch (host) {
        case "tatooine.moscar.ro":
            return TestPlayerWrapper;
        case "www.netflix.com":
            return CadmiumPlayerWrapper;
    }
}