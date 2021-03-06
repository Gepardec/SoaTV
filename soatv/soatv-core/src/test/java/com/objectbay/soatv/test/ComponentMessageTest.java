package com.objectbay.soatv.test;

import static org.junit.Assert.assertEquals;

import org.junit.Before;
import org.junit.Test;

import com.objectbay.soatv.jms.messaging.ComponentMessage;
import com.objectbay.soatv.jms.messaging.MessageIO;
import com.objectbay.soatv.jms.messaging.XMLComponentMessageReader;

public class ComponentMessageTest {
	private static final String testMessage = "<message>\n\t<id>  testId </id>\n\t<node>testNode </node>\n\t<component type=\"type\">\t  testComponent</component><status>SENT</status>\n</message>";
	
	private static final String wrongTestMessage = "<messages>\n\t<id>testId</id>\n\t<node>testNode</node>\n\t<component>testComponent</component><status>SEN</status>\n</message>";

	private MessageIO reader;
	
	
	@Before
	public void setUp(){
		reader	= new XMLComponentMessageReader();
	}
	
	@Test
	public void correctXMLInputCreatesCorrectMessage(){
		reader.init(testMessage);
		
		ComponentMessage message = ComponentMessage.createMessage(reader);
		assertEquals("testId", message.getId());
		assertEquals("testNode", message.getNode());
		assertEquals("testComponent", message.getComponent().getValue());
		assertEquals("type", message.getComponent().getType());
		assertEquals("SENT", message.getStatus());
	}
	
	@Test(expected=RuntimeException.class)
	public void incorrectXMLInputThrowsException(){
		reader.init(wrongTestMessage);
		ComponentMessage.createMessage(reader);
	}
}
