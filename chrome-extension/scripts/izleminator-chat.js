'use strict';

window.IzleminatorChat = class {   
    constructor(args) {
        this.playerMedia   = args.playerMedia;
        this.playerWrapper = args.playerWrapper;
        var chatClient    = args.chatClient;

        console.dir(chatClient);

        $(this.playerMedia).css({
            'width': '80%',
            'float': 'left'
        });

        $(this.playerWrapper).addClass('izl_izleminated');
        $(this.playerMedia).after("<div id='izl-cw'><div id='chat-history'></div><textarea id='chatbox' rows='3'/></div>");

        var self = this;

        chatClient.onOpen = function(e) {
            $("#izl-cw #chatbox").keydown(function(e){
                if(e.keyCode == 13) {
                    var message = $(this).val();
                    console.log(message)
                    $(this).val('');
                    chatClient.sendMessage(message);
                    e.preventDefault();
                }
            e.stopPropagation();
            });
        }
 
        chatClient.onMessage = function(event) {
            var message = JSON.parse(event.data);
            self.appendMessage(message.content, 'user');
        }

        chatClient.onclose = function(evt) {
            console.log("onclose.");
        };
        chatClient.onerror = function(evt) {
            console.log("Error!");
            console.dir(evt);
        };


        chatClient.open();
    }

    appendMessage(message, owner) {
        $('#chat-history').append( '<p class="chat-item owner-' + owner + '"><span class="screen-name">Someone:</span>' + message + '</p>');
    }
}