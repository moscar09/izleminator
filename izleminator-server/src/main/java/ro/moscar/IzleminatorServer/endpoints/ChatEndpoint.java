package ro.moscar.IzleminatorServer.endpoints;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

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
	private static Map<String, ChatEndpoint> endpoints = new ConcurrentHashMap<String, ChatEndpoint>();
 
    @OnOpen
    public void onOpen(Session session) throws IOException, EncodeException {
    	this.session = session;
    	endpoints.put(session.getId(), this);
    	session.getBasicRemote().sendObject(new Message("Welcome"));
    }
 
    @OnMessage
    public void onMessage(Session session, Message message) throws IOException {
    	System.out.println("got a message" + message.getContent());
    	broadcast(message);
    }
 
    @OnClose
    public void onClose(Session session) throws IOException {
    	endpoints.remove(session.getId());
        System.out.println("Closing session" + session.getId());
    }
 
    @OnError
    public void onError(Session session, Throwable throwable) {
        // Do error handling here
    }
    
    private void broadcast(Message message) {
    	endpoints.values().forEach(endpoint -> {
    		synchronized(endpoint) {
		    	try {
		    		System.out.println("Sending to " + endpoint.session.getId());
					endpoint.session.getBasicRemote().sendObject(message);
				} catch (IOException | EncodeException e) {
					e.printStackTrace();
				}
    	    }
    	});
    }
}