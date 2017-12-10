'use strict';
window.TestPlayerWrapper = class {
    constructor(communicator) {
        this.player       = $("#playerWrapper");
        this.communicator = communicator;

        var pauseObj = document.getElementById("pause");
        var startObj = document.getElementById("start");
        var self = this;

        self.inboundActions = {
            seek: 0,
            pause: 0
        };

        communicator.onMessage = function(message) {
            switch(message.data.action) {
                case "seekPlayer":
                    self.inboundActions.seek++;
                    self.seek(message.data.position);
                    break;
                case "pausePlayer":
                    self.inboundActions.pause++;
                    self.pause();
                    break;
            }
        }

        pauseObj.addEventListener("click", function(){
            if(self.inboundActions.pause > 0) {
                self.inboundActions.pause--;
            } else {
                self.communicator.postMessage('pausePlayer');
            }
        });

        startObj.addEventListener("click", function(){
            if(self.inboundActions.seek > 0) {
                self.inboundActions.seek--;
            } else {
                var position = startObj.getAttribute("data-position");
                self.communicator.postMessage('seekPlayer', {position: position});
            }
        });

    }

    static get playerMedia() {
        return $("#playerContent");
    }

    static get playerWrapper() {
        return $("#playerWrapper");
    }

    static isContextReady() {
        return true;
    }

    pause() {
        this.player.find("#state").html("Pausing");
    }

    seek(position) {
        this.player.find("#state").html("Seeking to positon " + position);
    }

    start() {
        this.player.find("#state").html("Playing");
    }

}
