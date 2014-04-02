package com.objectbay.soatv.jms;

import javax.ejb.ActivationConfigProperty;
import javax.ejb.MessageDriven;
import javax.enterprise.event.Event;
import javax.inject.Inject;
import javax.jms.JMSException;
import javax.jms.Message;
import javax.jms.MessageListener;
import javax.jms.TextMessage;

@MessageDriven(name = "MessageMDBSample", activationConfig = {
@ActivationConfigProperty(propertyName = "destinationType", propertyValue = "javax.jms.Topic"),
@ActivationConfigProperty(propertyName = "destination", propertyValue = "topic/soatvTopic"),
@ActivationConfigProperty(propertyName = "acknowledgeMode", propertyValue = "Auto-acknowledge") })
public class TopicListener implements MessageListener{
	
	public class TopicListenerOnMessageEvent{
		Message message;
		
		public TopicListenerOnMessageEvent(Message message) {
			this.message = message;
		}
		
		public Message getMessage(){
			return message;
		}
	}
	
	@Inject Event<TopicListenerOnMessageEvent> event;
	
	public void onMessage(Message arg0) {		
		try {
			System.out.println("SOATV received a message: " + ((TextMessage)arg0).getText());
		} catch (JMSException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		event.fire(new TopicListenerOnMessageEvent(arg0));
	}
	
}
