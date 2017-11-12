'use strict';
window.CadmiumPlayerWrapper = class {
    constructor(communicator) {
        this.videoElement = document.getElementsByTagName('video')[0];
        this.communicator = communicator;

        var videoPlayer     = netflix.appContext.state.playerApp.getAPI().videoPlayer;
        var playerSessionId = videoPlayer.getAllPlayerSessionIds()[0];
        this.videoPlayer    = videoPlayer.getVideoPlayerBySessionId(playerSessionId);

        var self = this;

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

    pause() {
        this.videoPlayer.pause();
    }

    seek(position) {
        this.videoPlayer.seek(position);
    }

    start() {
        this.videoPlayer.play();
    }

}
