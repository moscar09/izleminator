'use strict';

require('./components/emoji-bar.js');

window.IzleminatorChat = class {
    constructor(args) {
        this.playerMedia   = playerClass.playerMedia;
        this.playerWrapper = playerClass.playerWrapper;
        this.chatClient    = args.chatClient;
        this.latestMessageOwner = null;
        this.userUuid           = null;

        var chat_html = "<div id='izl-chat'><div id='izl-cw'><div id='chat-history'></div><textarea id='chatbox' rows='3'></textarea></div><ul id='izl-emojis'></ul></div>";
        var chat_element = new DOMParser().parseFromString(chat_html, 'text/html').body.childNodes[0];

        playerClass.izleminate({
            wrapper_class: 'izl_izleminated',
            chat_html: chat_element,
        });

        this.textbox  = document.querySelector("#izl-cw #chatbox");
        this.emojiBar = new EmojiBar();
    }

    onOpenCallback(event) {
        var self = this;
        self.textbox.addEventListener("keydown", function(e){

            if(e.key.match(/^[:a-z_]$/i) || e.key == 'Backspace') {
                var found = this.value.substring(0, this.selectionStart).match(/:[a-z_]{2,}:?$/i);

                if(found) {
                    var emojiCode = e.key == 'Backspace'
                        ? found[0].substring(0, found[0].length - 1)
                        : found[0] + e.key;

                    self.emojiBar.show(emojiCode.trim());

                    var emoji = self.emojiBar.getEmoji(emojiCode);

                    if (emoji) {
                        this.value = this.value.replace(found[0], emoji);
                        self.emojiBar.hide();
                        e.preventDefault();
                    }
                } else {
                    self.emojiBar.hide();
                }

            } else if(self.emojiBar.isActive() && (e.key == 'ArrowLeft' || e.key == 'ArrowRight')) {
                e.key == 'ArrowLeft' ? self.emojiBar.sendLeft() : self.emojiBar.sendRight();
                e.preventDefault();
            } else if(e.key == 'Enter') {

                if(self.emojiBar.isActive()) {
                    var found = this.value.substring(0, this.selectionStart).match(/:[a-z_]{2,}:?$/i);
                    if(found) {
                        var emoji = self.emojiBar.autocompleteEmoji();
                        this.value = this.value.replace(found[0], emoji);
                        e.preventDefault();
                    }
                } else {
                    self._submitMessage();
                }
                e.preventDefault();
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
        this.appendMessage({
            content: content,
            fromUuid: 'SYSTEM',
        });
    }

    displayUserMessage(message) {
        this.appendMessage(message, message.fromUuid);
    }

    _submitMessage(message) {
        if (this.textbox.value == '') return;
        this.emojiBar.hide();

        this.chatClient.sendMessage(this.textbox.value, IzleminatorClient.MessageTypeEnum.CHAT);
        this.textbox.value = '';
    }


    appendMessage(message, fromUuid) {
        var chatHistory = document.getElementById("chat-history");
        if (message.fromUuid != this.latestMessageOwner) {
            this.latestMessageOwner = message.fromUuid;

            var messageOwner;
            if (message.fromUuid == 'SYSTEM') {
                messageOwner = 'system';
                var newItem = `<div class="chat-item owner-${messageOwner}"></div>`;
            } else {
                 messageOwner = message.fromUuid == this.userUuid ? "user" : "world";
                var newItem = `<div class="chat-item owner-${messageOwner}"><p class="screen-name">${message.from}:</p></div>`;
            }
            chatHistory.innerHTML += newItem;
        }

        var chatItems = chatHistory.getElementsByClassName("chat-item");
        chatItems[chatItems.length - 1].innerHTML += `<p class="message">${message.content}</p>`;
    }
}