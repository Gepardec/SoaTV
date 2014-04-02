package com.objectbay.soatv.agent;

import javax.inject.Singleton;
import javax.jms.Connection;
import javax.jms.ConnectionFactory;
import javax.jms.JMSException;
import javax.jms.MessageProducer;
import javax.jms.Session;
import javax.jms.TextMessage;
import javax.jms.Topic;
import javax.naming.Context;
import javax.naming.InitialContext;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Class that assist components of enterprise environment to send status messages to the soatv topic
 * @author eerofeev
 *
 */
@Singleton
public class Agent {
	
	private static Logger log = LoggerFactory.getLogger(Agent.class);
	
	private String nodeName;
	private String componentName;
	private String messageId;
	private String messageStatus;
	
	private String jndiTopic;
	private String jndiCF;
	
	public Agent(){
		
	}
	
	/**
	 * Sets jndi topic name
	 * @param jndiTopicName
	 * @return current instance of Agent
	 */
	public Agent topic(String jndiTopicName){
		jndiTopic = jndiTopicName;
		return this;
	}
	
	/**
	 * Sets jndi Connection Factory name
	 * @param jndiCFName
	 * @return current instance of Agent
	 */
	public Agent cf(String jndiCFName){
		jndiCF = jndiCFName;
		return this;
	}
	
	/**
	 * Sets node name to be sent with the message
	 * @param jndiCFName
	 * @return current instance of Agent
	 */
	public Agent node(String node){
		nodeName = node;
		return this;
	}
	
	/**
	 * Sets component name to be sent with the message
	 * @param component
	 * @return current instance of Agent
	 */
	public Agent component(String component){
		componentName = component;
		return this;
	}
	
	/**
	 * Sets message id
	 * @param id
	 * @return current instance of Agent
	 */
	public Agent id(String id){
		messageId = id;
		return this;
	}
	
	/**
	 * Sets message status. Supports "sent" and "received"
	 * @param status
	 * @return current instance of Agent
	 */
	public Agent status(String status){
		messageStatus = status != null ? status.toUpperCase() : null;
		return this;
	}
	
	/**
	 * Sends prepared status message
	 */
	public void send(){
		
		if(nodeName == null){
			log.warn("Node name is not set, use node() for this. Message sending skipped");
			return;
		}
		
		if(componentName == null){
			log.warn("Component name is not set, use component() for this. Message sending skipped");
			return;
		}
		
		if(messageId == null){
			log.warn("Message id is not set, use id() for this. Message sending skipped");
			return;
		}
		
		if(messageStatus == null){
			log.warn("Message status is not set, use status() for this. Message sending skipped");
			return;
		}
		
		AgentMessage message = new AgentMessage(messageId);
		message.setSenderComponentId(componentName);
		message.setSenderNodeId(nodeName);
		message.setStatus(messageStatus);
		
		String msgString = message.toXMLString();
		if(msgString == null){
			log.warn("Error occured while creating message XML. Sending skipped");
			return;
		}
		
		sendMessage(msgString);
		
	}
	
	/**
	 * Sends message to topic
	 */
	private void sendMessage(String msg){
		if(jndiTopic == null){
			log.warn("JNDI topic name is not set, use topic() for this.");
			return;
		}
		
		if(jndiCF == null){
			log.warn("JNDI Connection Factory name is not set, use cf() for this.");
			return;
		}
		
		Context ic;
		ConnectionFactory cf;
		Connection connection = null;

		try {
			ic = new InitialContext();
			cf = (ConnectionFactory) ic.lookup(jndiCF);
			//Queue queue = (Queue) ic.lookup(destinationName);
			Topic topic = (Topic) ic.lookup(jndiTopic);
			connection = cf.createConnection();
			Session session = connection.createSession(false,
					Session.AUTO_ACKNOWLEDGE);
			MessageProducer publisher = session.createProducer(topic);
			connection.start();
			
			TextMessage message = session.createTextMessage(msg);
			publisher.send(message);
			
		} catch (Exception e){
			log.warn("Exception occured {}", e);
		} finally {

			if (connection != null) {
				try {
					connection.close();
				} catch (JMSException e) {
					e.printStackTrace();
				}
			}
		}
	}
}
