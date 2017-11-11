package ro.moscar.IzleminatorServer.chat;

public interface IMessage {
	public String getContent();
	public void setContent(String content);
	public String getFrom();
	public void setFrom(String from);
	public MessageType getMessageType();	
}
