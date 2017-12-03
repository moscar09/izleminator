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

import ro.moscar.IzleminatorServer.chat.IMessage;
import ro.moscar.IzleminatorServer.chat.MessageDecoder;
import ro.moscar.IzleminatorServer.chat.MessageEncoder;
import ro.moscar.IzleminatorServer.chat.MessageType;
import ro.moscar.IzleminatorServer.chat.messages.ControlMessage;
import ro.moscar.IzleminatorServer.chat.messages.SystemMessage;
import ro.moscar.IzleminatorServer.chat.room.Room;
import ro.moscar.IzleminatorServer.chat.room.User;

@ServerEndpoint(value = "/chat/{room}/{username}", decoders = MessageDecoder.class, encoders = MessageEncoder.class)
public class ChatEndpoint {
	private Room room;
	private User user;
	private static Map<String, Room> rooms = new ConcurrentHashMap<String, Room>();

	@OnOpen
	public void onOpen(Session session, @PathParam("username") String username, @PathParam("room") String roomName)
			throws IOException, EncodeException {
		this.user = new User(username, session);

		if (rooms.containsKey(roomName)) {
			this.room = rooms.get(roomName);
		} else {
			this.room = new Room(roomName);
			rooms.put(roomName, room);
		}

		user.sendMessage(new SystemMessage("Welcome " + username));
		user.sendMessage(new ControlMessage("userid:" + user.getUuid()));
		room.broadcast(new SystemMessage(username + " has joined."));
		room.addUser(user);

		System.out.println(String.format("Opening session %s. Room %s has %d users", session.getId(), room.getName(),
				room.getUserCount()));
	}

	@OnMessage
	public void onMessage(Session session, IMessage message) throws IOException {
		message.setFrom(user.getUsername());
		message.setFromUuid(user.getUuid());

		System.out.println(user.getUsername() + ": " + message.getContent());

		if (message.getMessageType() == MessageType.HEARTBEAT) {
			try {
				user.sendMessage(message);
			} catch (EncodeException e) {
				e.printStackTrace();
			}
		} else {
			room.broadcast(message);
		}
	}

	@OnClose
	public void onClose(Session session) throws IOException {
		room.removeUser(user.getId());
		System.out.println(String.format("Closing session %s. Room %s has %d users", session.getId(), room.getName(),
				room.getUserCount()));

		if (room.getUserCount() == 0) {
			rooms.remove(room.getName());
		}
	}

	@OnError
	public void onError(Session session, Throwable throwable) {
		System.out.println("Error");
	}
}