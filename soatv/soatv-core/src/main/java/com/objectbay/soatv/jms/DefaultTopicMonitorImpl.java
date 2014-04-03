package com.objectbay.soatv.jms;

import java.io.Serializable;

import javax.inject.Inject;
import javax.inject.Named;
import javax.jms.Message;
import javax.jms.TextMessage;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.objectbay.soatv.jms.messaging.ComponentMessage;
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
	public synchronized void onMessage(Message message) {
		try {
			componentMessageReader.init(((TextMessage)message).getText());
			ComponentMessage componentMessage = ComponentMessage.createMessage(componentMessageReader);
			
			addMessage(componentMessage);
			
			
		} catch (Exception e) {
			log.warn("{}", e);
		}
	}

}
