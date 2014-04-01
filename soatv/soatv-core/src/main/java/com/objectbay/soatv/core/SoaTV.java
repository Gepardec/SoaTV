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
	
	/*public static SoaTV getInstance(){
		if(instance == null){
			instance = new SoaTV();
		}
		
		return instance;
	}*/
	
	/**
	 * Creates new messaging context for the given web-socket session
	 * @param session
	 * @return
	 */
	/*public MessagingContext createMessagingContext(Session session){
		MessagingContext context = new MessagingContext(new DefaultProcessingMessenger());
		context.setSession(session);
		messagingContexts.add(context);
		return context;
	}*/
	
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
			TopicMonitor m = messagingContext.getMonitor();
			if(m != null){
				m.onMessage(event.getMessage());
			}
		}
	}
}
