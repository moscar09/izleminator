package ro.moscar.IzleminatorServer.chat;

import static org.junit.Assert.assertEquals;

import java.util.UUID;

import javax.websocket.EncodeException;

import org.junit.Test;

import com.google.gson.JsonObject;

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
		message.setFromUuid(UUID.randomUUID().toString());
		MessageEncoder encoder = new MessageEncoder();

		JsonObject json = new JsonObject();
		json.addProperty("messageType", "chat");
		json.addProperty("content", message.getContent());
		json.addProperty("from", message.getFrom());
		json.addProperty("fromUuid", message.getFromUuid());
		try {
			String encoded = encoder.encode(message);
			assertEquals(json.toString(), encoded);
		} catch (EncodeException e) {
			e.printStackTrace();
		}
	}

}
