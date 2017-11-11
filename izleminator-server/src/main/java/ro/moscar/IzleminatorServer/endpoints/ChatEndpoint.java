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
import javax.websocket.server.PathParam;
import javax.websocket.server.ServerEndpoint;

import ro.moscar.IzleminatorServer.chat.AbstractMessage;
import ro.moscar.IzleminatorServer.chat.MessageDecoder;
import ro.moscar.IzleminatorServer.chat.MessageEncoder;
import ro.moscar.IzleminatorServer.chat.SystemMessage;

@ServerEndpoint(
	value = "/chat/{room}/{username}",
	  decoders = MessageDecoder.class, 
	  encoders = MessageEncoder.class
)
public class ChatEndpoint {
	private Session session;
	private static Map<String, ChatEndpoint> endpoints = new ConcurrentHashMap<String, ChatEndpoint>();
	private static Map<String, String> users = new ConcurrentHashMap<String, String>();
 
    @OnOpen
    public void onOpen(Session session, @PathParam("username") String username) throws IOException, EncodeException {
    	this.session = session;
    	endpoints.put(session.getId(), this);
    	users.put(session.getId(), username);
    	session.getBasicRemote().sendObject(new SystemMessage("Welcome " + username));
    }
 
    @OnMessage
    public void onMessage(Session session, AbstractMessage message) throws IOException {
    	System.out.println("got a message" + message.getContent());
    	String user = users.get(session.getId());
    	message.setFrom(user);
    	broadcast(message);
    }
 
    @OnClose
    public void onClose(Session session) throws IOException {
    	endpoints.remove(session.getId());
        System.out.println("Closing session" + session.getId());
    }
 
    @OnError
    public void onError(Session session, Throwable throwable) {
        System.out.println("Error");
    }
    
    private void broadcast(AbstractMessage message) {
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