'use strict';
window.TestPlayerWrapper = class {
    constructor(communicator) {
        this.player       = $("#playerWrapper");
        this.communicator = communicator;

        var pauseObj = document.getElementById("pause");
        var startObj = document.getElementById("start");
        var self = this;

        
        pauseObj.addEventListener("click", function(){
            console.log("player paused");
            self.communicator.postMessage('pausePlayer');
        });

        startObj.addEventListener("click", function(){
            var position = startObj.getAttribute("data-position");
            self.communicator.postMessage('seekPlayer', {position: position});
        });

    }

    static get playerMedia() {
        return $("#playerContent");
    }

    static get playerWrapper() {
        return $("#playerWrapper");
    }

    static get includeFilename() {
        return "test-player-wrapper.js";
    }

    static isContextReady() {
        return this.playerWrapper.length == 1;
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
