'use strict';

window.IzleminatorChat = class {
    constructor(args) {
        this.playerMedia   = args.playerMedia;
        this.playerWrapper = args.playerWrapper;
        this.chatClient    = args.chatClient;

        $(this.playerMedia).css({
            'width': '80%',
            'float': 'left'
        });

        $(this.playerWrapper).addClass('izl_izleminated');
        $(this.playerMedia).after("<div id='izl-cw'><div id='chat-history'></div><textarea id='chatbox' rows='3'/></div>");

        var self = this;
    }

    onOpenCallback(event, self) {
        $("#izl-cw #chatbox").keydown(function(e){
            if(e.keyCode == 13) {
                var message = $(this).val();
                console.log(message)
                $(this).val('');
                self.chatClient.sendMessage(message, IzleminatorClient.MessageTypeEnum.CHAT);
                e.preventDefault();
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
                    case "playerSeek":
                    case "playerPause":
                    case "playerStart":
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

    onErrorCallback(event, self) {}

    appendMessage(message, owner, screenName) {
        $('#chat-history').append( '<p class="chat-item owner-' + owner + '"><span class="screen-name">' + screenName + ':</span>' + message + '</p>');
    }
}