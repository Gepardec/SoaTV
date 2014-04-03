package com.objectbay.soatv.test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

import java.util.Observable;
import java.util.Observer;

import org.junit.Before;
import org.junit.Test;

import com.objectbay.soatv.agent.AgentMessage.MessageStatus;
import com.objectbay.soatv.jms.DefaultTopicMonitorImpl;
import com.objectbay.soatv.jms.TopicMonitorEvent;
import com.objectbay.soatv.jms.TopicMonitorEvent.TopicMonitorEventType;
import com.objectbay.soatv.jms.messaging.ComponentMessage;

public class DefaultTopicMonitorTest implements Observer{
	
	private DefaultTopicMonitorImpl monitor;
	private ComponentMessage[] messages;
	private TopicMonitorEvent lastEvent;
	
	@Before
	public void setUp(){
		monitor = new DefaultTopicMonitorImpl();
		messages = new ComponentMessage[]{new ComponentMessage("0"), new ComponentMessage("1"), new ComponentMessage("0"), new ComponentMessage("1")};
		messages[0].setSenderNodeId("node1");
		messages[0].setSenderComponentId("component1");
		messages[0].setStatus(MessageStatus.SENT);
		
		messages[1].setSenderNodeId("node2");
		messages[1].setSenderComponentId("component2");
		messages[1].setStatus(MessageStatus.SENT);
		
		messages[2].setSenderNodeId("node1");
		messages[2].setSenderComponentId("component1");
		messages[2].setStatus(MessageStatus.RECEIVED);
		
		messages[3].setSenderNodeId("node2");
		messages[3].setSenderComponentId("component2");
		messages[3].setStatus(MessageStatus.RECEIVED);
		
		monitor.addListener(this);
	}
	
	@Test
	public void DefaultMonitorProvidesCorrectBehaviourInCaseOfCorrectData(){
		monitor.addComponent("node1", "component1");
		monitor.addMessage(messages[0]);
		assertEquals(messages[0], monitor.getMessages("0").get(0));
		assertTrue(monitor.getNodeComponents("node1").contains("component1"));
		assertFalse(monitor.getNodeComponents("node1").contains("component2"));
		assertFalse(monitor.getNodeComponents("node2").contains("component2"));
		
		monitor.addComponent("node2", "component2");
		assertTrue(monitor.getNodeComponents("node2").contains("component2"));
		
		monitor.addMessage(messages[1]);
		assertEquals(messages[1], monitor.getMessages("1").get(0));
		
		monitor.addMessage(messages[2]);
		monitor.addMessage(messages[3]);
		
		assertTrue(monitor.getMessages("1").contains(messages[1]));
		assertTrue(monitor.getMessages("1").contains(messages[3]));
	}
	

	@Test
	public void DefaultMonitorPreventsIncorrectBehaiviourInCaseOfWrongMessageSequence(){
		monitor.addComponent("node1", "component1");
		monitor.addComponent("node2", "component2");
		monitor.addMessage(messages[0]);
		
		assertTrue(lastEvent.getType() == TopicMonitorEventType.MESSAGE_SENT);
		lastEvent = null;
		
		monitor.addMessage(messages[2]);
		
		assertTrue(lastEvent.getType() == TopicMonitorEventType.MESSAGE_RECEIVED);
		lastEvent = null;
		
		monitor.addMessage(messages[3]);
		assertTrue(null == lastEvent);
		
		monitor.addMessage(messages[1]);
		assertTrue(lastEvent.getType() == TopicMonitorEventType.MESSAGE_RECEIVED);
			
	}

	@Override
	public void update(Observable arg0, Object arg1) {
		lastEvent = (TopicMonitorEvent)arg1;		
	}
	
}
