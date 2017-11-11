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

        self.chatClient.onOpen    = function(e) { self.onOpenCallback(e, self); }
        self.chatClient.onMessage = function(e) { self.onMessageCallback(e, self); }
        self.chatClient.onClose   = function(e) { self.onCloseCallback(e, self); }
        self.chatClient.onError   = function(e) { self.onErrorCallback(e, self); }

        self.chatClient.open();
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
        console.dir(message);
        self.appendMessage(message.content, message.messageType, message.from);
    }

    onCloseCallback(event, self) {
        console.log("on Close");
    }

    onErrorCallback(event, self) {
        console.log("on Error");
    }

    appendMessage(message, type, screenName) {
        $('#chat-history').append( '<p class="chat-item owner-' + type + '"><span class="screen-name">' + screenName + ':</span>' + message + '</p>');
    }
}