'use strict';
window.JWPlayerWrapper = class {
    constructor(_jwPlayer) {
        this.jwPlayer = _jwPlayer;
    }

    pause() {
        this.jwPlayer().pause(true);
    }

    seek(position) {
        console.log("Seeking to positon " + position);
        this.jwPlayer().seek(position);
    }

    start() {
        this.jwPlayer().pause(false);
    }

}
