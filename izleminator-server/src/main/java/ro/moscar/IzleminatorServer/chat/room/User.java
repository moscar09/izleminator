package ro.moscar.IzleminatorServer.chat.room;

import java.io.IOException;
import java.util.UUID;

import javax.websocket.EncodeException;
import javax.websocket.Session;

import ro.moscar.IzleminatorServer.chat.IMessage;

public class User {
	private final String username;
	private final Session session;
	private final String uuid;

	public User(String username, Session session) {
		uuid = UUID.randomUUID().toString();
		this.session = session;
		this.username = username;
	}

	public String getUsername() {
		return username;
	}

	public String getId() {
		return session.getId();
	}

	public String getUuid() {
		return uuid;
	}

	public void sendMessage(IMessage message) throws IOException, EncodeException {
		session.getBasicRemote().sendObject(message);
	}

	public Session getSession() {
		return session;
	}

}
