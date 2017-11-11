'use strict';
window.TestPlayerWrapper = class {
    constructor(_player) {
        this.player        = _player;
        this.playerMedia   = $("#playerContent");
        this.playerWrapper = $("#playerWrapper")
    }

    pause() {
        this.player().pause(true);
    }

    seek(position) {
        console.log("Seeking to positon " + position);
        this.player().seek(position);
    }

    start() {
        this.player().pause(false);
    }

}
