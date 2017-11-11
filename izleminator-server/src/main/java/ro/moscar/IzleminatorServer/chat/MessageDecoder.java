package ro.moscar.IzleminatorServer.chat;

import java.util.Map;

import javax.websocket.DecodeException;
import javax.websocket.Decoder;
import javax.websocket.EndpointConfig;

import com.google.gson.Gson;

public class MessageDecoder implements Decoder.Text<AbstractMessage> {
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
	public AbstractMessage decode(String s) throws DecodeException {
		Map<String, String> data = gson.fromJson(s, Map.class);

		switch(data.get("messageType").toString()) {
		case "system":
			return new SystemMessage(data.get("content"));
		case "control":
			return new ControlMessage(data.get("content"));
		default:
			return new ChatMessage(data.get("content"));
		}
	}

	@Override
	public boolean willDecode(String s) {
		return s != null;
	}

}
