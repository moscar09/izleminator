'use strict';
window.CadmiumPlayerWrapper = class {
    constructor(communicator) {
    }

    static get playerMedia() {
        return $('.NFPlayer');
    }

    static get playerWrapper() {
        return $('.NFPlayer');
    }

    static get includeFilename() {
        return "cadmium-player-wrapper.js";
    }

    static isContextReady() {
        return this.playerWrapper.length == 1;
    }

    pause() {
    }

    seek(position) {
    }

    start() {
    }

}
