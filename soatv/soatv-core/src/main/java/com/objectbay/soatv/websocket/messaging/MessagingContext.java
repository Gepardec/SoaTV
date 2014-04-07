package com.objectbay.soatv.websocket.messaging;

import java.io.IOException;
import java.io.Serializable;
import java.util.Observable;
import java.util.Observer;

import javax.inject.Inject;
import javax.inject.Named;
import javax.websocket.Session;

import com.objectbay.soatv.jms.TopicMonitor;
import com.objectbay.soatv.jms.TopicMonitorEvent;
import com.objectbay.soatv.jms.messaging.MessageIO;
import com.objectbay.soatv.utils.CDIUtils.DefaultMessenger;
import com.objectbay.soatv.utils.CDIUtils.DefaultTopicMonitor;
import com.objectbay.soatv.utils.CDIUtils.DefaultWebSocketMessageIO;
import com.objectbay.soatv.websocket.messaging.Messaging.Messenger;
import com.objectbay.soatv.websocket.messaging.WebSocketMessage.Action;

/**
 * MessagingContext is a room for conversation between a client and server.
 * It also holds the knowledge about opened session, and is
 * responsible for sending and receiving messages. Messaging context
 * also listening evens of topic monitor.
 * Normally there is one MessagingContext instance per connection.
 * @author eerofeev
 *
 */

@Named
public class MessagingContext implements Serializable, Observer {
	/**
	 * 
	 */
	private static final long serialVersionUID = -2183923435680685517L;
	private Session session;
	
	@Inject
	@DefaultMessenger
	private Messenger messenger;
	
	@Inject
	@DefaultTopicMonitor 
	private TopicMonitor monitor;
	
	@Inject @DefaultWebSocketMessageIO
	private MessageIO webSocketMessageIO;
	
	public MessagingContext(){
	}
	
	public Session getSession() {
		return session;
	}
	public void setSession(Session session) {
		this.session = session;
	}
	public Messenger getMessenger() {
		return messenger;
	}
	public void setMessednger(Messenger messenger) {
		this.messenger = messenger;
	}

	public TopicMonitor getMonitor() {
		return monitor;
	}

	public void setMonitor(TopicMonitor monitor) {
		this.monitor = monitor;
	}

	@Override
	public void update(Observable o, Object arg) {
		if(arg instanceof TopicMonitorEvent){
			TopicMonitorEvent event = (TopicMonitorEvent) arg;
			switch (event.getType()){
			case NEW_NODE :
				webSocketMessageIO.writeProperty("action", Action.RESPONSE_NEW_NODE);
				break;
			case NEW_COMPONENT :
				webSocketMessageIO.writeProperty("action", Action.RESPONSE_NEW_COMPONENT);
				break;
			case NEW_MESSAGE :
				webSocketMessageIO.writeProperty("action", Action.RESPONSE_NEW_MESSAGE);
				break;
			case MESSAGE :
				webSocketMessageIO.writeProperty("action", Action.RESPONSE_MESSAGE);
				break;
			}
			
			webSocketMessageIO.writeProperty("data", event.getData());
			try {
				String message = (String) webSocketMessageIO.flush();
				messenger.getMessageSender().sendMessage(message);
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
	}	
}
