package ro.moscar.IzleminatorServer.chat.room;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import javax.websocket.EncodeException;

import ro.moscar.IzleminatorServer.chat.IMessage;
import ro.moscar.IzleminatorServer.chat.User;

public class Room {
	private String name;
	private Map<String, User> users = new ConcurrentHashMap<String, User>();

	public Room(String name) {
		this.name = name;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public void addUser(User user) {
		users.put(user.getId(), user);
	}

	public void broadcast(IMessage message) {
		users.values().forEach(user -> {
			try {
				user.sendMessage(message);
			} catch (IOException | EncodeException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		});
	}
}
