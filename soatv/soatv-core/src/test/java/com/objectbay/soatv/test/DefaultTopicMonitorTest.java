package com.objectbay.soatv.test;

import org.junit.Before;
import org.junit.Test;

import com.objectbay.soatv.jms.DefaultTopicMonitorImpl;
import com.objectbay.soatv.jms.messaging.ComponentMessage;
import com.objectbay.soatv.jms.messaging.ComponentMessage.MessageStatus;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

public class DefaultTopicMonitorTest {
	
	private DefaultTopicMonitorImpl monitor;
	private ComponentMessage[] messages;
	
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
	}
	
	@Test
	public void DefaultMonitorProvidesCorrectBehaviourInCaseOfCorrectData(){
		monitor.addComponent("node1", "component1");
		monitor.addMessage(messages[0]);
		assertEquals(messages[0], monitor.getMessage(MessageStatus.SENT, "0"));
		assertTrue(monitor.getNodeComponents("node1").contains("component1"));
		assertFalse(monitor.getNodeComponents("node1").contains("component2"));
		assertFalse(monitor.getNodeComponents("node2").contains("component2"));
		
		monitor.addComponent("node2", "component2");
		assertTrue(monitor.getNodeComponents("node2").contains("component2"));
		
		monitor.addMessage(messages[1]);
		assertEquals(messages[1], monitor.getMessage(MessageStatus.SENT, "1"));
		
		monitor.addMessage(messages[2]);
		monitor.addMessage(messages[3]);
		
		assertTrue(monitor.getMessages("1").contains(messages[1]));
		assertTrue(monitor.getMessages("1").contains(messages[3]));
	}
	

	public void DefaultMonitorPreventsIncorrectBehaiviourInCaseOfWrongMessageSequence(){
		monitor.addComponent("node1", "component1");
		monitor.addComponent("node2", "component2");
		monitor.addMessage(messages[0]);
		monitor.addMessage(messages[2]);
		monitor.addMessage(messages[3]);
		monitor.addMessage(messages[1]);
		
		assertTrue(monitor.getMessages("0").contains(messages[0]));
		assertTrue(monitor.getMessages("0").contains(messages[2]));
		
		assertEquals(messages[1], monitor.getMessages("1").get(1));
		assertEquals(1, monitor.getMessages("1").size());
	
	}
	
}
