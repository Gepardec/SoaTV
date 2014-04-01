package com.objectbay.soatv.jms;

import java.io.Serializable;

import javax.inject.Inject;
import javax.inject.Named;
import javax.jms.Message;
import javax.jms.TextMessage;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.objectbay.soatv.jms.TopicMonitorEvent.TopicMonitorEventType;
import com.objectbay.soatv.jms.messaging.ComponentMessage;
import com.objectbay.soatv.jms.messaging.ComponentMessage.MessageStatus;
import com.objectbay.soatv.jms.messaging.MessageIO;
import com.objectbay.soatv.utils.CDIUtils.DefaultComponentMessageIO;
import com.objectbay.soatv.utils.CDIUtils.DefaultTopicMonitor;

@Named
@DefaultTopicMonitor
public class DefaultTopicMonitorImpl extends TopicMonitor implements Serializable {
	private static Logger log = LoggerFactory.getLogger(DefaultTopicMonitorImpl.class);
	/**
	 * 
	 */
	private static final long serialVersionUID = -7208669236410978491L;
	@Inject @DefaultComponentMessageIO
	private MessageIO componentMessageReader;
	@Override
	public void onMessage(Message message) {
		try {
			componentMessageReader.init(((TextMessage)message).getText());
			ComponentMessage componentMessage = ComponentMessage.createMessage(componentMessageReader);
			
			MessageStatus status = componentMessage.getStatus();
			if(status == MessageStatus.RECEIVED && !containsMessage(MessageStatus.SENT, componentMessage.getId())){
				log.warn("Message with the status RECEIVED occured before message with the status SEND");
				return;
			}
			
			//check if node is new
			if(!nodeExists(componentMessage.getSenderNodeId())){
				notifyObservers(new TopicMonitorEvent(TopicMonitorEventType.NEW_NODE, componentMessage.getSenderNodeId()));
				notifyObservers(new TopicMonitorEvent(TopicMonitorEventType.NEW_COMPONENT, componentMessage));
				addComponent(componentMessage.getSenderNodeId(), componentMessage.getSenderComponentId());
			} else if(!componentExists(componentMessage.getSenderNodeId(), componentMessage.getSenderComponentId())){
				notifyObservers(new TopicMonitorEvent(TopicMonitorEventType.NEW_COMPONENT, componentMessage));
				addComponent(componentMessage.getSenderNodeId(), componentMessage.getSenderComponentId());
			}
			
			TopicMonitorEventType type = status == MessageStatus.SENT ? TopicMonitorEventType.MESSAGE_SENT : TopicMonitorEventType.MESSAGE_RECEIVED;
			notifyObservers(new TopicMonitorEvent(type, componentMessage));
			addMessage(componentMessage);
			
			
		} catch (Exception e) {
			log.warn("{}", e);
		}
	}

}
