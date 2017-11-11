'use strict';
window.TestPlayerWrapper = class {
    constructor(_player) {
        this.player        = _player;
    }

    static get playerMedia() {
        return $("#playerContent");
    }

    static get playerWrapper() {
        return $("#playerWrapper");
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
