'use strict';

window.IzleminatorChat = class {
    constructor(args) {
        this.playerMedia   = playerClass.playerMedia;
        this.playerWrapper = playerClass.playerWrapper;
        this.chatClient    = args.chatClient;

        var chat_html = "<div id='izl-cw'><div id='chat-history'></div><textarea id='chatbox' rows='3'></textarea></div>";
        var chat_element = new DOMParser().parseFromString(chat_html, 'text/html').body.childNodes[0];

        playerClass.izleminate({
            wrapper_class: 'izl_izleminated',
            chat_html: chat_element,
        });

        var self = this;
    }

    onOpenCallback(event, self) {
        document.querySelector("#izl-cw #chatbox").addEventListener("keydown", function(e){
            if(e.keyCode == 13) {
                e.preventDefault();
                var message = this.value;
                if (message == '') return;

                self.chatClient.sendMessage(message, IzleminatorClient.MessageTypeEnum.CHAT);
                this.value = '';
            }
        e.stopPropagation();
        });
    }

    onMessageCallback(event, self) {
        var message = JSON.parse(event.data);

        switch(message.messageType) {
            case IzleminatorClient.MessageTypeEnum.CONTROL:
                let content;
                var controlParams = message.content.split(":");
                switch(controlParams[0]) {
                    case "userid":
                        if (typeof self.fromUuid == 'undefined')
                            self.fromUuid = controlParams[1];
                        break;
                    case "seekPlayer":
                        content = message.from + " jumped to " + controlParams[1];
                        self.appendMessage(content, "system", "System");
                        break;

                    case "seekAndStartPlayer":
                        content = message.from + " started playing at " + controlParams[1];
                        self.appendMessage(content, "system", "System");
                        break;
                    case "pausePlayer":
                        content = message.from + " paused.";
                        self.appendMessage(content, "system", "System");
                        break;
                }
                break;
            case IzleminatorClient.MessageTypeEnum.SYSTEM:
                self.appendMessage(message.content, "system", message.from);
                break;
            case IzleminatorClient.MessageTypeEnum.CHAT:
            var messageOwner = message.fromUuid == self.fromUuid ? "user" : "world";
                self.appendMessage(message.content, messageOwner, message.from);
                break;
        }

    }

    onCloseCallback(event, self) {
        var message = "Connection closed.";
        message += event.reason ? event.reason : "";
        self.appendMessage(message, "system", "system");
    }

    onErrorCallback(event, self) {
        var message = "There was an error.";
        message += event.reason ? event.reason : "";
        self.appendMessage(message, "system", "system");
    }

    appendMessage(message, owner, screenName) {
        document.getElementById("chat-history").innerHTML += '<p class="chat-item owner-' + owner + '"><span class="screen-name">' + screenName + ':</span>' + message + '</p>';
    }
}