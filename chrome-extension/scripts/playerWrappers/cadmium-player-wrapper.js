'use strict';
window.CadmiumPlayerWrapper = class {
    constructor(communicator) {
        this.videoElement = document.getElementsByTagName('video')[0];
        this.communicator = communicator;

        var videoPlayer     = netflix.appContext.state.playerApp.getAPI().videoPlayer;
        var playerSessionId = videoPlayer.getAllPlayerSessionIds()[0];
        this.videoPlayer    = videoPlayer.getVideoPlayerBySessionId(playerSessionId);

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


        this.videoElement.addEventListener("play", function(e) {
            var position = e.timeStamp;
            self.communicator.postMessage('seekPlayer', {position: position});       

        })

        this.videoElement.addEventListener("pause", function(e) {
            self.communicator.postMessage('pausePlayer');            
        })
    }

    static get playerMedia()     { return $('.NFPlayer'); }
    static get playerWrapper()   { return $('.NFPlayer'); }
    static get includeFilename() { return "cadmium-player-wrapper.js"; }
    static isContextReady()      { return this.playerWrapper.length == 1; }

    pause() { this.videoPlayer.pause(); }
    start() { this.videoPlayer.play(); }
    seek(position) { this.videoPlayer.seek(position); }
}
