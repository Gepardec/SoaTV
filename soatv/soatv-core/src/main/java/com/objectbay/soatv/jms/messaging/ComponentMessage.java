package com.objectbay.soatv.jms.messaging;

import com.objectbay.soatv.utils.MessageFieldUtils;


/**
 * Class represents messages that can be received by soatv monitor
 * from jms topic and representing action performed by some component
 * in some node (e.g. message is sent, or message is received).
 * Component messages are in their nature log messages that components
 * may sent in the log topic while performing operations with messages
 * that contain business data.
 * @author eerofeev
 *
 */
public class ComponentMessage {
	
	public static enum MessageStatus{
		
		SENT(1), RECEIVED(2);
		
		int value;
		private MessageStatus(int value){
			this.value = value;
		}
		
		public int getValue(){
			return value;
		}
		
	}
	
	MessageStatus status;
	String id;
	String senderNodeId;
	String senderComponentId;
	String body;
	
	public ComponentMessage(String id) {
		status = MessageStatus.SENT;
		this.id = id;
	}
	
	public String getSenderNodeId() {
		return senderNodeId;
	}

	public void setSenderNodeId(String senderNodeId) {
		this.senderNodeId = senderNodeId;
	}

	public String getSenderComponentId() {
		return senderComponentId;
	}

	public void setSenderComponentId(String senderComponentId) {
		this.senderComponentId = senderComponentId;
	}
	
	/**
	 * Identifies whether message has the given status set
	 * @param status
	 * @return true if the given status is set
	 */
	public boolean hasStatus(MessageStatus status){
		return this.status == status;
	}
	
	/**
	 * Returns message status
	 */
	public MessageStatus getStatus(){
		return status;
	}
	
	/**
	 * Sets given status
	 * @param status
	 */
	public void setStatus(MessageStatus status){
		this.status = status;
	}
	
	/**
	 * Sets given status represented as string
	 * @param status
	 */
	public void setStatus(String status){
		this.status = MessageStatus.valueOf(status);
	}
	
	/**
	 * Creates new message instance and set it as sent message
	 * @param nodeId
	 * @param componentId
	 * @return
	 */
	public static ComponentMessage createMessage(String id, String nodeId, String componentId){
		ComponentMessage instance = new ComponentMessage(id);
		instance.setStatus(MessageStatus.SENT);
		instance.setSenderNodeId(nodeId);
		instance.setSenderComponentId(componentId);
		
		return instance;
	}
	
	/**
	 * Creates new message instance using ActionMessageIO
	 * @param nodeId
	 * @param componentId
	 * @return
	 */
	public static ComponentMessage createMessage(MessageIO reader){
		ComponentMessage instance = new ComponentMessage(MessageFieldUtils.cleanValue((String)reader.readProperty("id")));
		instance.setStatus(MessageFieldUtils.cleanValue((String)reader.readProperty("status")));
		instance.setSenderNodeId(MessageFieldUtils.cleanValue((String)reader.readProperty("node")));
		instance.setSenderComponentId(MessageFieldUtils.cleanValue((String)reader.readProperty("component")));
		return instance;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getBody() {
		return body;
	}

	public void setBody(String body) {
		this.body = body;
	}
}
