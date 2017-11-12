"use strict";

var izl_communicator = class {
    static postMessage(action, extraData) {
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
new playerClass(izl_communicator);    

function getPlayerClass(host) {
    switch (host) {
        case "tatooine.moscar.ro":
            return TestPlayerWrapper;
        case "www.netflix.com":
            return CadmiumPlayerWrapper;
    }
}