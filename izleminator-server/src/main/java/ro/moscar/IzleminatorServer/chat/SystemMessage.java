package ro.moscar.IzleminatorServer.chat;

public class SystemMessage extends AbstractMessage implements IMessage {
	private static final MessageType messageType = MessageType.SYSTEM;

	public SystemMessage(String content) {
		super(content);
		this.setFrom("System");
	}

	public MessageType getMessageType() {
		return messageType;
	}
}
