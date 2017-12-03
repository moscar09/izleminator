package ro.moscar.IzleminatorServer.chat.room;

import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.websocket.EncodeException;

import org.junit.Test;

import ro.moscar.IzleminatorServer.chat.IMessage;
import ro.moscar.IzleminatorServer.chat.messages.ChatMessage;

public class RoomTest {
	private String roomName = "testRoom";

	@Test
	public void roomShouldHaveCorrectName() {
		Room room = new Room(roomName);

		assertEquals(room.getName(), roomName);
	}

	@Test
	public void roomShouldHaveCorrectNumberOfUsers() {
		Room room = new Room(roomName);

		for (Integer i = 0; i < 5; i++) {
			User mockUser = mock(User.class);
			when(mockUser.getId()).thenReturn(i.toString());
			room.addUser(mockUser);
		}
		assertEquals(room.getUserCount(), 5);

		room.removeUser("0");
		assertEquals(room.getUserCount(), 4);
	}

	@Test
	public void roomShouldBroadcastMessageToAllUsers() {
		Room room = new Room(roomName);
		List<User> users = new ArrayList<User>();
		IMessage message = new ChatMessage("heyo");

		for (Integer i = 0; i < 5; i++) {
			User mockUser = mock(User.class);
			when(mockUser.getId()).thenReturn(i.toString());
			users.add(mockUser);
			room.addUser(mockUser);
		}

		room.broadcast(message);

		users.forEach(user -> {
			try {
				verify(user).sendMessage(message);
			} catch (IOException | EncodeException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		});

	}
}
