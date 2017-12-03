package ro.moscar.IzleminatorServer.chat;

import java.util.Map;

import javax.websocket.DecodeException;
import javax.websocket.Decoder;
import javax.websocket.EndpointConfig;

import com.google.gson.Gson;

import ro.moscar.IzleminatorServer.chat.messages.ChatMessage;
import ro.moscar.IzleminatorServer.chat.messages.ControlMessage;
import ro.moscar.IzleminatorServer.chat.messages.HeartbeatMessage;

public class MessageDecoder implements Decoder.Text<IMessage> {
	private Gson gson = new Gson();

	@Override
	public void init(EndpointConfig config) {
		// TODO Auto-generated method stub

	}

	@Override
	public void destroy() {
		// TODO Auto-generated method stub

	}

	@Override
	public IMessage decode(String s) throws DecodeException {
		@SuppressWarnings("unchecked")
		Map<String, String> data = gson.fromJson(s, Map.class);

		switch (data.get("messageType").toString()) {
		case "control":
			return new ControlMessage(data.get("content"));
		case "heartbeat":
			return new HeartbeatMessage();
		default:
			return new ChatMessage(data.get("content"));
		}
	}

	@Override
	public boolean willDecode(String s) {
		return s != null;
	}

}
