package ro.moscar.IzleminatorServer.chat.messages;

import ro.moscar.IzleminatorServer.chat.IMessage;
import ro.moscar.IzleminatorServer.chat.MessageType;

public class HeartbeatMessage extends AbstractMessage implements IMessage {
	private static final MessageType messageType = MessageType.HEARTBEAT;
	
	public HeartbeatMessage() {
		super("HB");
	}

	public MessageType getMessageType() {
		return messageType;
	}
}
