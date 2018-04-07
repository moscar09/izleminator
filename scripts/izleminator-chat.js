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
                var controlParams = message.content.split(":");
                switch(controlParams[0]) {
                    case "userid":
                        if (typeof self.fromUuid == 'undefined')
                            self.fromUuid = controlParams[1];
                        break;
                    case "seekPlayer":
                        self.displaySystemMessage(`${message.from} jumped to ${controlParams[1]}.`);
                        break;
                    case "seekAndStartPlayer":
                        self.displaySystemMessage(`${message.from} started playing at ${controlParams[1]}.`);
                        break;
                    case "pausePlayer":
                        self.displaySystemMessage(`${message.from} paused.`);
                        break;
                }
                break;
            case IzleminatorClient.MessageTypeEnum.SYSTEM:
                self.displaySystemMessage(message.content);
                break;
            case IzleminatorClient.MessageTypeEnum.CHAT:
                self.displayUserMessage(message);
                break;
        }

    }

    onCloseCallback(event, self) {
        var message = "Connection closed.";
        message += event.reason ? event.reason : "";
        self.displaySystemMessage(message);
    }

    onErrorCallback(event, self) {
        var message = "There was an error.";
        message += event.reason ? event.reason : "";
        self.displaySystemMessage(message);
    }

    displaySystemMessage(content) {
        document.getElementById("chat-history").innerHTML += '<p class="chat-item owner-system">' + content + '</p>';
    }

    displayUserMessage(message) {
        var messageOwner = message.fromUuid == self.fromUuid ? "user" : "world";
        document.getElementById("chat-history").innerHTML += '<p class="chat-item owner-' + messageOwner + '"><span class="screen-name">' + message.from + ':</span>' + message.content + '</p>';
    }
}