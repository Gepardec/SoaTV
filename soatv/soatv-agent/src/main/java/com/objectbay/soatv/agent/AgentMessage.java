package com.objectbay.soatv.agent;

import java.io.StringWriter;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Marshaller;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@XmlRootElement(name = "message")
@XmlAccessorType(XmlAccessType.FIELD)
public class AgentMessage {
	
	private static Logger log = LoggerFactory.getLogger(AgentMessage.class);

	public static enum MessageStatus {

		SENT(1), RECEIVED(2);

		int value;

		private MessageStatus(int value) {
			this.value = value;
		}

		public int getValue() {
			return value;
		}

	}

	@XmlElement(name = "status") MessageStatus status;
	@XmlElement(name = "id") String id;
	@XmlElement(name = "node") String senderNodeId;
	@XmlElement(name = "component") String senderComponentId;

	public AgentMessage(String id) {
		status = MessageStatus.SENT;
		this.id = id.replaceAll("-|:", "");
	}
	
	public AgentMessage() {
		// TODO Auto-generated constructor stub
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
	 * 
	 * @param status
	 * @return true if the given status is set
	 */
	public boolean hasStatus(MessageStatus status) {
		return this.status == status;
	}

	/**
	 * Returns message status
	 */
	public MessageStatus getStatus() {
		return status;
	}

	/**
	 * Sets given status
	 * 
	 * @param status
	 */
	public void setStatus(MessageStatus status) {
		this.status = status;
	}

	/**
	 * Sets given status represented as string
	 * 
	 * @param status
	 */
	public void setStatus(String status) {
		this.status = MessageStatus.valueOf(status);
	}

	/**
	 * Creates new message instance and set it as sent message
	 * 
	 * @param nodeId
	 * @param componentId
	 * @return
	 */
	public static AgentMessage createMessage(String id, String nodeId,
			String componentId) {
		AgentMessage instance = new AgentMessage(id);
		instance.setStatus(MessageStatus.SENT);
		instance.setSenderNodeId(nodeId);
		instance.setSenderComponentId(componentId);

		return instance;
	}


	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id.replaceAll("-|:", "");
	}
	
	/**
	 * Converts message to xml string
	 * @return
	 */
	public String toXMLString(){
		StringWriter writer = new StringWriter();
		try {
			JAXBContext context = JAXBContext.newInstance(AgentMessage.class);            
			Marshaller m = context.createMarshaller();
			m.marshal(this, writer);
			return writer.toString();
		} catch (JAXBException e) {
			log.warn("{}", e);
			return null;
		}
	}

}
