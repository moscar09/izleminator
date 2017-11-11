package ro.moscar.IzleminatorServer.chat;

public class ChatMessage extends AbstractMessage implements IMessage {
	private static final MessageType messageType = MessageType.CHAT;
	
	public ChatMessage(String content) {
		super(content);
	}

	public MessageType getMessageType() {
		return messageType;
	}
}
