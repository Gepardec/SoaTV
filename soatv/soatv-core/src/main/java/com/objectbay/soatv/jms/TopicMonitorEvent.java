package com.objectbay.soatv.jms;

/**
 * Class represents events on topic monitor
 * @author eerofeev
 *
 */
public class TopicMonitorEvent {
	
	public enum TopicMonitorEventType{
		NEW_NODE,
		NEW_COMPONENT,
		NEW_MESSAGE,
		MESSAGE
	};
	
	private TopicMonitorEventType type;
	private Object data;
	
	public TopicMonitorEvent(TopicMonitorEventType type, Object data) {
		this.type = type;
		this.data = data;
	}
	
	public Object getData() {
		return data;
	}
	public void setData(Object data) {
		this.data = data;
	}
	public TopicMonitorEventType getType() {
		return type;
	}
	public void setType(TopicMonitorEventType type) {
		this.type = type;
	}
}
