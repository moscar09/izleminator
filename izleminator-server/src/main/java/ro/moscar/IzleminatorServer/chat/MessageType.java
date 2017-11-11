package ro.moscar.IzleminatorServer.chat;

import com.google.gson.annotations.SerializedName;

public enum MessageType {
	@SerializedName("chat")
	CHAT,
	@SerializedName("system")
	SYSTEM,
	@SerializedName("control")
	CONTROL;
}
