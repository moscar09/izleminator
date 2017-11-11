package ro.moscar.IzleminatorServer.chat;

import java.util.UUID;

public class User {
	private final String username;
	private final String id;
	private final String uuid;

	public User (String username, String id) {
		uuid = UUID.randomUUID().toString();
		this.id = id;
		this.username = username;
	}
	
	public String getUsername() {
		return username;
	}
	
	public String getId() {
		return id;
	}
	
	public String getUuid() {
		return uuid;
	}
	
}
