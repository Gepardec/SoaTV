package com.objectbay.soatv.example.node2;

import javax.ejb.ActivationConfigProperty;
import javax.ejb.MessageDriven;
import javax.enterprise.event.Event;
import javax.inject.Inject;
import javax.jms.JMSException;
import javax.jms.Message;
import javax.jms.MessageListener;

import com.objectbay.soatv.agent.Agent;

@MessageDriven(name = "MessageMDBSample", activationConfig = {
@ActivationConfigProperty(propertyName = "destinationType", propertyValue = "javax.jms.Topic"),
@ActivationConfigProperty(propertyName = "destination", propertyValue = "topic/soatvExampleTopic"),
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
	
	private static int count = 0;
	
	@Inject Event<TopicListenerOnMessageEvent> event;
	@Inject Agent agent;
	
	public void onMessage(Message arg0) {
		
		try {
			agent.cf("/ConnectionFactory").topic("topic/soatvTopic")
			.node("My JBoss 2")
			.component("Topic Listener" + count++)
			.id(arg0.getJMSMessageID())
			.status("received")
			.send();
			if(count > 4) count = 0;
		} catch (JMSException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
}