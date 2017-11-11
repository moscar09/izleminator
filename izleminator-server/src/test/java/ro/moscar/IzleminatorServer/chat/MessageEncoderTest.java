package ro.moscar.IzleminatorServer.chat;

import static org.junit.Assert.*;

import java.util.UUID;

import javax.websocket.EncodeException;

import org.junit.Test;

import ro.moscar.IzleminatorServer.chat.messages.ChatMessage;
import ro.moscar.IzleminatorServer.chat.messages.ControlMessage;
import ro.moscar.IzleminatorServer.chat.messages.SystemMessage;

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
		message.setFrom("user");
		String uuid = UUID.randomUUID().toString();
		message.setFromUuid(uuid);
		MessageEncoder encoder = new MessageEncoder();
		
		try {
			String encoded = encoder.encode(message);
			System.out.println(encoded);
			assertEquals("{\"messageType\":\"chat\",\"content\":\"Chat message\",\"from\":\"user\",\"fromUuid\":\""+ uuid + "\"}", encoded);
		} catch (EncodeException e) {
			e.printStackTrace();
		}
	}

}
