package ro.moscar.IzleminatorServer.chat.room;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.io.IOException;

import javax.websocket.EncodeException;
import javax.websocket.RemoteEndpoint.Basic;
import javax.websocket.Session;

import org.junit.Test;

import ro.moscar.IzleminatorServer.chat.IMessage;
import ro.moscar.IzleminatorServer.chat.messages.HeartbeatMessage;

public class UserTest {
	@Test
	public void userShouldHaveCorrectFields() {
		String username = "testington";
		String userId = "7";

		Session mockedSession = mock(Session.class);
		when(mockedSession.getId()).thenReturn(userId);

		User user = new User(username, mockedSession);

		assertEquals(user.getUsername(), username);
		assertEquals(user.getId(), userId);
		assertTrue(user.getUuid()
				.matches("^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"));
		assertEquals(user.getSession(), mockedSession);
	}

	@Test
	public void shouldSendMessageToRemote() throws IOException, EncodeException {
		Session mockedSession = mock(Session.class);
		Basic mockedBasicRemote = mock(Basic.class);
		when(mockedSession.getBasicRemote()).thenReturn(mockedBasicRemote);
		IMessage message = new HeartbeatMessage();

		User user = new User("testington", mockedSession);
		user.sendMessage(message);

		verify(mockedBasicRemote).sendObject(message);
	}
}