package ro.moscar.IzleminatorServer.endpoints;

import java.io.IOException;

import javax.websocket.EncodeException;
import javax.websocket.OnClose;
import javax.websocket.OnError;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;

import ro.moscar.IzleminatorServer.chat.Message;
import ro.moscar.IzleminatorServer.chat.MessageDecoder;
import ro.moscar.IzleminatorServer.chat.MessageEncoder;

@ServerEndpoint(
	value = "/chat/{username}",
	  decoders = MessageDecoder.class, 
	  encoders = MessageEncoder.class
)
public class ChatEndpoint {
	private Session session;
 
    @OnOpen
    public void onOpen(Session session) throws IOException {
    	this.session = session;
    	broadcast(new Message("Successfully connected!"));
    }
 
    @OnMessage
    public void onMessage(Session session, Message message) throws IOException {
    	broadcast(new Message("Have a message!"));
    }
 
    @OnClose
    public void onClose(Session session) throws IOException {
        // WebSocket connection closes
    }
 
    @OnError
    public void onError(Session session, Throwable throwable) {
        // Do error handling here
    }
    
    private void broadcast(Message message) {
    	try {
			session.getBasicRemote().sendObject(message);
		} catch (IOException | EncodeException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
    }
}