'use strict';

window.CadmiumPlayerWrapper = class {
    constructor(communicator) {
        this.communicator = communicator;
        this.scrubberBar  = document.getElementsByClassName('scrubber-bar')[0];
        // maybe getElement()

        this.videoElement = document.getElementsByTagName('video')[0];

        var self = this;

        var observer = new MutationObserver(function(mutationsList) {
            for(var mutation of mutationsList) {
                if(mutation.type == 'attributes' && mutation.attributeName == 'src') {
                    self.videoElement = document.getElementsByTagName('video')[0];
                    if(self.videoElement == undefined ) {
                        return;
                    }

                    self.addEventListeners();
                    this.disconnect();
                    self.communicator.postMessage('nextEpisode', {episode_id: self.videoPlayer.getElement().id});
                    this.observe(self.videoElement, {attributes: true, characterData: true});
                }
            }
        });

        observer.observe(this.videoElement, {attributes: true, characterData: true});

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

        this.addEventListeners();
    }

    static get playerMedia()     { return document.getElementsByClassName('NFPlayer')[0]; }
    static get playerWrapper()   { return document.getElementsByClassName('NFPlayer')[0]; }
    static isContextReady()      { return this.playerWrapper != undefined; }

    static izleminate(args) {
        this.playerMedia.style.width    = '80%';
        this.playerMedia.style.float    = 'left';

        this.playerWrapper.className += args.wrapper_class;
        this.playerMedia.parentNode.insertBefore(args.chat_html, this.playerMedia.nextSibling);
    }

    addEventListeners() {
        var self = this;
        var videoPlayer     = netflix.appContext.state.playerApp.getAPI().videoPlayer;
        var playerSessionId = videoPlayer.getAllPlayerSessionIds()[0];
        this.videoPlayer    = videoPlayer.getVideoPlayerBySessionId(playerSessionId);

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

        this.scrubberBar.addEventListener("click", function(e) {
            if(self.inboundActions.seek > 0) {
                self.inboundActions.seek--;
            } else {
                self.communicator.postMessage('seekPlayer', {position: self.getSeekPosition()});
            }
        });

        this.heartBeat();
    }

    pause() { this.videoPlayer.pause(); }
    start() { this.videoPlayer.play(); }
    getSeekPosition() { return this.videoPlayer.getCurrentTime() }
    seek(position)    { this.videoPlayer.seek(position); }

    heartBeat() {
        var self = this;

        self.communicator.postMessage('heartbeat', { position: self.getSeekPosition() });
        setTimeout( function() { self.heartBeat() }, 2000 );

    }

}
