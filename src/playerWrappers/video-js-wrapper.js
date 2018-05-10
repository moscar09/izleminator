'use strict';

window.VideoJsWrapper = class {
    constructor(communicator) {
        this.videoPlayer  = this.constructor.playerMedia;
        this.scrubberBar  = this.constructor.playerScrubber;
        this.communicator = communicator;

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

        this.videoPlayer.onplay = function(e) {
            if (self.inboundActions.seekAndPlay > 0) {
                self.inboundActions.seekAndPlay--;
            } else {
                var position = self.getSeekPosition();
                self.communicator.postMessage('seekAndStartPlayer', {position: position});
            }
        };

        this.videoPlayer.onpause = function(e) {
            if(self.inboundActions.pause > 0) {
                self.inboundActions.pause--;
            } else {
                self.communicator.postMessage('pausePlayer');
            }
        };

        this.videoPlayer.onseeked = function(e) {
            console.log("Caught seeking");
            if (self.inboundActions.seek > 0) {
                self.inboundActions.seek--;
            } else {
                var position = self.getSeekPosition();
                self.communicator.postMessage('seekPlayer', {position: position});
            }
        }

        this.heartBeat();
    }

    static get playerMedia()     { return document.getElementsByClassName('vjs-tech')[0]; }
    static get playerWrapper()   { return document.getElementsByClassName('video-js')[0]; }
    static get playerScrubber()  { return document.getElementsByClassName('vjs-control-bar')[0]; }
    static isContextReady()      { return this.playerWrapper != undefined; }

    static izleminate(args) {
        this.playerMedia.style.width    = '80%';
        this.playerMedia.style.float    = 'left';
        this.playerScrubber.style.width = '80%';

        this.playerWrapper.className += args.wrapper_class;
        this.playerMedia.parentNode.insertBefore(args.chat_html, this.playerMedia.nextSibling);
    }

    pause() { this.videoPlayer.pause(); }
    start() { this.videoPlayer.play(); }
    getSeekPosition() { return this.videoPlayer.currentTime }
    seek(position)    { this.videoPlayer.currentTime = position; }

    heartBeat() {
        var self = this;

        self.communicator.postMessage('heartbeat', { position: self.getSeekPosition() });
        setTimeout( function() { self.heartBeat() }, 2000 );

    }

}
