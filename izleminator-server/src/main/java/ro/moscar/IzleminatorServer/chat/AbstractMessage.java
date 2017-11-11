package ro.moscar.IzleminatorServer.chat;

public abstract class AbstractMessage {
	private String content;
	private String from;
	
	public AbstractMessage(String content) {
		this.content = content;
	}
	
	public String getContent() {
		return content;
	}
	
	public void setContent(String content) {
		this.content = content;
	}
	
	public String getFrom() {
		return from;
	}
	
	public void setFrom(String from) {
		this.from = from;
	}
}
