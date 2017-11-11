package ro.moscar.IzleminatorServer.chat.messages;

import ro.moscar.IzleminatorServer.chat.IMessage;
import ro.moscar.IzleminatorServer.chat.MessageType;

public class ControlMessage extends AbstractMessage implements IMessage {
	private static final MessageType messageType = MessageType.CONTROL;

	public ControlMessage(String content) {
		super(content);
	}

	public MessageType getMessageType() {
		return messageType;
	}
}
