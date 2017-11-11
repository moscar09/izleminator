package ro.moscar.IzleminatorServer.chat;

import static org.junit.Assert.*;

import javax.websocket.EncodeException;

import org.junit.Test;

public class MessageEncoderTest {

	@Test
	public void shouldEncodeSystemMessages() {
		IMessage message = new SystemMessage("System message");
		MessageEncoder encoder = new MessageEncoder();
		
		try {
			String encoded = encoder.encode(message);
			assertEquals("{\"messageType\":\"system\",\"content\":\"System message\",\"from\":\"System\"}", encoded);
		} catch (EncodeException e) {
			e.printStackTrace();
		}
	}

	@Test
	public void shouldEncodeControlMessages() {
		IMessage message = new ControlMessage("Control message");
		MessageEncoder encoder = new MessageEncoder();
		
		try {
			String encoded = encoder.encode(message);
			assertEquals("{\"messageType\":\"control\",\"content\":\"Control message\"}", encoded);
		} catch (EncodeException e) {
			e.printStackTrace();
		}
	}

	@Test
	public void shouldEncodeChatMessages() {
		IMessage message = new ChatMessage("Chat message");
		MessageEncoder encoder = new MessageEncoder();
		
		try {
			String encoded = encoder.encode(message);
			assertEquals("{\"messageType\":\"chat\",\"content\":\"Chat message\"}", encoded);
		} catch (EncodeException e) {
			e.printStackTrace();
		}
	}

}
