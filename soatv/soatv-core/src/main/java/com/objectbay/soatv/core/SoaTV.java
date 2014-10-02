package com.objectbay.soatv.core;

import java.util.HashSet;
import java.util.Set;

import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.event.Observes;

import com.objectbay.soatv.jms.TopicMonitor;
import com.objectbay.soatv.jms.TopicListener.TopicListenerOnMessageEvent;
import com.objectbay.soatv.websocket.messaging.MessagingContext;

/**
 * Main class of soatv application, which handles all web-sockets connections.
 * A single instance should be created per web application.
 * @author eerofeev 
 *
 */
@ApplicationScoped
public class SoaTV {
	//private static SoaTV instance;
	private Set<MessagingContext> messagingContexts;
	
	public SoaTV(){
		messagingContexts = new HashSet<MessagingContext>();
	}
	
	/**
	 * Destroys given messaging context
	 * @param context
	 */
	public void destroyMessagingContext(MessagingContext context){
		messagingContexts.remove(context);
	}
	
	/**
	 * Returns list of all active messaging contexts
	 * @return
	 */
	public Set<MessagingContext> getMessagingContexts(){
		return messagingContexts;
	}
	
	public void onTopicMessage(@Observes TopicListenerOnMessageEvent event){
		for(MessagingContext messagingContext : messagingContexts){
			TopicMonitor topicMonitor = messagingContext.getMonitor();
			if(topicMonitor != null){
				topicMonitor.onMessage(event.getMessage());
			}
		}
	}
}
