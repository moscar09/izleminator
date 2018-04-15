'use strict';

window.IzleminatorClient = class {
    constructor(args) {
        this.username     = args.username;
        this.roomname     = args.roomname;
        this.websocketUri = args.websocketUri + "/" + this.roomname + "/" + this.username;
    }

    set onOpen(_onOpenCallback) {
        this.onOpenCallback = _onOpenCallback;
    }

    set onMessage(_onMessageCallback) {
        this.onMessageCallback = _onMessageCallback;
    }

    set onClose(_onCloseCallback) {
        this.onCloseCallback = _onCloseCallback;
    }

    set onError(_onErrorCallback) {
        this.onErrorCallback = _onErrorCallback;
    }

    open() {
        this.socket            = new WebSocket(this.websocketUri);
        this.socket.onmessage  = this.onMessageCallback;
        this.socket.onclose    = this.onCloseCallback;
        this.socket.onerror    = this.onErrorCallback;
        var self = this;
        this.socket.onopen     = function () {
            self.onOpenCallback();
        };
    }

    close() {
        this.socket.close();
    }

    sendMessage(message, messageType, additionalData = {}) {
        var payload = {
            messageType: messageType,
            content: message
        };

        Object.assign(payload, additionalData);

        if (messageType != IzleminatorClient.MessageTypeEnum.HEARTBEAT){
            console.dir(payload);
        }
        this.socket.send(JSON.stringify(payload));
    }

    heartBeat( position ) {
        var self = this;

        if(self.socket.readyState === self.socket.CLOSED) {
            return
        }
        self.sendMessage("HB:" + position, IzleminatorClient.MessageTypeEnum.HEARTBEAT);
    }
}

IzleminatorClient.MessageTypeEnum = Object.freeze({
    CHAT:    "chat",
    CONTROL: "control",
    HEARTBEAT: "heartbeat",
    SYSTEM:  "system",
});
