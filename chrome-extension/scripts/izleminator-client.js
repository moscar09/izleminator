'use strict';

window.IzleminatorClient = class {
    
    constructor(_websocketUri) {
        this.websocketUri = _websocketUri;
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
        this.socket.onopen     = this.onOpenCallback;
        this.socket.onmessage  = this.onMessageCallback;
        this.socket.onclose    = this.onCloseCallback;
        this.socket.onerror    = this.onErrorCallback;

    }

    close() {
        this.socket.close();
    }

    sendMessage(message) {
        this.socket.send(JSON.stringify({
            content: message
        }));
    }
}

window.IzleminatorClient.MessageTypeEnum = Object.freeze({
    CHAT: "chat",
    SYSTEM: "system"
});
