package com.objectbay.soatv.test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

import java.util.Observable;
import java.util.Observer;

import org.junit.Before;
import org.junit.Test;

import com.objectbay.soatv.agent.NotificationMessage.Component;
import com.objectbay.soatv.jms.DefaultTopicMonitorImpl;
import com.objectbay.soatv.jms.TopicMonitorEvent;
import com.objectbay.soatv.jms.TopicMonitorEvent.TopicMonitorEventType;
import com.objectbay.soatv.jms.messaging.ComponentMessage;

public class DefaultTopicMonitorTest implements Observer{
	
	private DefaultTopicMonitorImpl monitor;
	private ComponentMessage[] messages;
	private TopicMonitorEvent lastEvent;
	Component c1, c2;
	
	@Before
	public void setUp(){
		monitor = new DefaultTopicMonitorImpl();
		
		c1 = new Component();
		c1.setType("type1");
		c1.setValue("component1");
		
		c2 = new Component();
		c2.setType("type2");
		c2.setValue("component2");
		
		
		messages = new ComponentMessage[]{new ComponentMessage("0"), new ComponentMessage("1"), new ComponentMessage("0"), new ComponentMessage("1")};
		messages[0].setNode("node1");
		messages[0].setComponent(c1);
		messages[0].setStatus("SENT");
		
		messages[1].setNode("node2");
		messages[1].setComponent(c2);
		messages[1].setStatus("SENT");
		
		messages[2].setNode("node1");
		messages[2].setComponent(c1);
		messages[2].setStatus("RECEIVED");
		
		messages[3].setNode("node2");
		messages[3].setComponent(c2);
		messages[3].setStatus("RECEIVED");
		
		monitor.addListener(this);
	}
	
	@Test
	public void DefaultMonitorProvidesCorrectBehaviourInCaseOfCorrectData(){
		monitor.addComponent("node1", c1);
		monitor.addMessage(messages[0]);
		assertEquals(messages[0], monitor.getMessages("0").get(0));
		assertTrue(monitor.getNodeComponents("node1").contains(c1));
		assertFalse(monitor.getNodeComponents("node1").contains(c2));
		assertFalse(monitor.getNodeComponents("node2").contains(c2));
		
		monitor.addComponent("node2", c2);
		assertTrue(monitor.getNodeComponents("node2").contains(c2));
		
		monitor.addMessage(messages[1]);
		assertEquals(messages[1], monitor.getMessages("1").get(0));
		
		monitor.addMessage(messages[2]);
		monitor.addMessage(messages[3]);
		
		assertTrue(monitor.getMessages("1").contains(messages[1]));
		assertTrue(monitor.getMessages("1").contains(messages[3]));
	}
	

	@Test
	public void DefaultMonitorPreventsIncorrectBehaiviourInCaseOfWrongMessageSequence(){
		monitor.addComponent("node1", c1);
		monitor.addComponent("node2", c2);
		monitor.addMessage(messages[0]);
		
		assertTrue(TopicMonitorEventType.NEW_MESSAGE == lastEvent.getType());
		lastEvent = null;
		
		monitor.addMessage(messages[2]);
		
		assertTrue(lastEvent.getType() == TopicMonitorEventType.MESSAGE);
		lastEvent = null;
		
		monitor.addMessage(messages[3]);
		assertTrue(TopicMonitorEventType.NEW_MESSAGE == lastEvent.getType());
		
		monitor.addMessage(messages[1]);
		assertTrue(lastEvent.getType() == TopicMonitorEventType.MESSAGE);
			
	}

	@Override
	public void update(Observable arg0, Object arg1) {
		lastEvent = (TopicMonitorEvent)arg1;		
	}
	
}
