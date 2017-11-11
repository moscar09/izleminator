package ro.moscar.IzleminatorServer.chat;

public class ControlMessage extends AbstractMessage implements IMessage {
	private static final MessageType messageType = MessageType.CONTROL;

	public ControlMessage(String content) {
		super(content);
	}

	public MessageType getMessageType() {
		return messageType;
	}
}
