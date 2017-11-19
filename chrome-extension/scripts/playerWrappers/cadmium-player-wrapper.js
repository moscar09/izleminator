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
            seekAndPlay: 0,
            pause: 0
        };

        communicator.onMessage = function(message) {
            switch(message.data.action) {
                case "seekPlayer":
                    self.inboundActions.seek++;
                    self.seek(message.data.position);
                    break;
                case "seekAndStartPlayer":
                    self.inboundActions.seekAndPlay++;
                    self.seek(message.data.position);
                    self.start();
                    break;
                case "pausePlayer":
                    self.inboundActions.pause++;
                    self.pause();
                    break;
            }
        }

        this.videoElement.addEventListener("play", function(e) {
            if (self.inboundActions.seekAndPlay > 0) {
                self.inboundActions.seekAndPlay--;
            } else {
                var position = self.getSeekPosition();
                self.communicator.postMessage('seekAndStartPlayer', {position: position});
            }
        });

        this.videoElement.addEventListener("pause", function(e) {
            if(self.inboundActions.pause > 0) {
                self.inboundActions.pause--;
            } else {
                self.communicator.postMessage('pausePlayer');
            }
        });

        this.videoElement.addEventListener("seeking", function(e) {
            if(self.inboundActions.seek > 0) {
                self.inboundActions.seek--;
            } else {
                self.communicator.postMessage('seekPlayer', {position: self.getSeekPosition()});
            }
        });
    }

    static get playerMedia()     { return $('.NFPlayer'); }
    static get playerWrapper()   { return $('.NFPlayer'); }
    static get includeFilename() { return "cadmium-player-wrapper.js"; }
    static isContextReady()      { return this.playerWrapper.length == 1; }

    pause() { this.videoPlayer.pause(); }
    start() { this.videoPlayer.play(); }
    getSeekPosition() { return this.videoPlayer.getCurrentTime() }
    seek(position)    { this.videoPlayer.seek(position); }
}
