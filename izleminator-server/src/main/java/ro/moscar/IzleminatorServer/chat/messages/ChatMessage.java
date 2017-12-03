package ro.moscar.IzleminatorServer.chat.messages;

import ro.moscar.IzleminatorServer.chat.IMessage;
import ro.moscar.IzleminatorServer.chat.MessageType;

public class ChatMessage extends AbstractMessage implements IMessage {
	private static final MessageType messageType = MessageType.CHAT;

	public ChatMessage(String content) {
		super(content);
	}

	public MessageType getMessageType() {
		return messageType;
	}
}
