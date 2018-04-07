'use strict';

window.IzleminatorChat = class {
    constructor(args) {
        this.playerMedia   = playerClass.playerMedia;
        this.playerWrapper = playerClass.playerWrapper;
        this.chatClient    = args.chatClient;
        this.latestMessageOwner = null;
        this.userUuid           = null;

        var chat_html = "<div id='izl-cw'><div id='chat-history'></div><textarea id='chatbox' rows='3'></textarea></div>";
        var chat_element = new DOMParser().parseFromString(chat_html, 'text/html').body.childNodes[0];

        playerClass.izleminate({
            wrapper_class: 'izl_izleminated',
            chat_html: chat_element,
        });
    }

    onOpenCallback(event) {
        var self = this;
        document.querySelector("#izl-cw #chatbox").addEventListener("keydown", function(e){
            if(e.keyCode == 13) {
                e.preventDefault();
                if (this.value == '') return;

                self.chatClient.sendMessage(this.value, IzleminatorClient.MessageTypeEnum.CHAT);
                this.value = '';
            }
            e.stopPropagation();
        });
    }

    onMessageCallback(event) {
        var message = JSON.parse(event.data);

        switch(message.messageType) {
            case IzleminatorClient.MessageTypeEnum.CONTROL:
                var controlParams = message.content.split(":");
                switch(controlParams[0]) {
                    case "userid":
                        if (this.userUuid == null)
                            this.userUuid = controlParams[1];
                        break;
                    case "seekPlayer":
                        this.displaySystemMessage(`${message.from} jumped to ${controlParams[1]}.`);
                        break;
                    case "seekAndStartPlayer":
                        this.displaySystemMessage(`${message.from} started playing at ${controlParams[1]}.`);
                        break;
                    case "pausePlayer":
                        this.displaySystemMessage(`${message.from} paused.`);
                        break;
                }
                break;
            case IzleminatorClient.MessageTypeEnum.SYSTEM:
                this.displaySystemMessage(message.content);
                break;
            case IzleminatorClient.MessageTypeEnum.CHAT:
                this.displayUserMessage(message);
                break;
        }

    }

    onCloseCallback(event) {
        var message = "Connection closed.";
        message += event.reason ? event.reason : "";
        this.displaySystemMessage(message);
    }

    onErrorCallback(event) {
        var message = "There was an error.";
        message += event.reason ? event.reason : "";
        this.displaySystemMessage(message);
    }

    displaySystemMessage(content) {
        this.latestMessageOwner = null;
        document.getElementById("chat-history").innerHTML += '<p class="chat-item owner-system">' + content + '</p>';
    }

    displayUserMessage(message) {
        var chatHistory = document.getElementById("chat-history");
        if (message.fromUuid != this.latestMessageOwner) {
            this.latestMessageOwner = message.fromUuid;
            var messageOwner = message.fromUuid == this.userUuid ? "user" : "world";
            var newItem = `<div class="chat-item owner-${messageOwner}"><p class="screen-name">${message.from}:</p></div>`;
            chatHistory.innerHTML += newItem;
        }

        var chatItems = chatHistory.getElementsByClassName("chat-item");
        chatItems[chatItems.length - 1].innerHTML += `<p class="message">${message.content}</p>`;
    }
}