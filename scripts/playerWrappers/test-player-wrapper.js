'use strict';
window.TestPlayerWrapper = class {
    constructor(communicator) {
        this.player       = this.constructor.playerMedia;
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
                seclf.inboundActions.seek--;
            } else {
                var position = startObj.getAttribute("data-position");
                self.communicator.postMessage('seekAndStartPlayer', {position: position});
            }
        });

    }

    static get playerMedia()   { return document.getElementById("playerContent"); }
    static get playerWrapper() { return document.getElementById("playerWrapper"); }
    static isContextReady()    { return document.getElementById("playerContent") != undefined; }

    static izleminate(args) {
        this.playerMedia.style.width    = '80%';
        this.playerMedia.style.float    = 'left';

        this.playerWrapper.className += args.wrapper_class;
        this.playerMedia.parentNode.insertBefore(args.chat_html, this.playerMedia.nextSibling);
    }


    pause() {
        document.getElementById("state").innerHTML = "Pausing";
    }

    seek(position) {
        document.getElementById("state").innerHTML = "Seeking to positon " + position;
    }

    start() {
        document.getElementById("state").innerHTML = "Playing";
    }

}
