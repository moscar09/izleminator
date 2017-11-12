"use strict";

window.addEventListener("load", function(event) {
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

    var player = new TestPlayerWrapper(izl_communicator);    
}
);