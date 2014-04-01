package com.objectbay.soatv.test;

import static org.junit.Assert.assertEquals;

import org.junit.Before;
import org.junit.Test;

import com.objectbay.soatv.jms.messaging.MessageIO;
import com.objectbay.soatv.jms.messaging.MessageIO.MessageIOInitializationException;
import com.objectbay.soatv.jms.messaging.XMLComponentMessageReader;

public class XMLComponentMessageReaderTest {
	private static final String testMessage = "<message>\n\t<id>testId</id>\n\t<node>testNode</node>\n\t<component>testComponent</component><status>SENT</status>\n</message>";
	
	private static final String wrongTestMessage = "<messages>\n\t<id>testId</id>\n\t<nod>testNode</nod>\n\t<component>testComponent</component><status>SENT</status>\n</message>";

	private MessageIO reader;
	
	
	@Before
	public void setUp(){
		reader	= new XMLComponentMessageReader();
	}
	
	@Test
	public void correctXMLInputIsParsedCorrectly(){
		reader.init(testMessage);
		assertEquals("testId", reader.readProperty("id"));
		assertEquals("testNode", reader.readProperty("node"));
		assertEquals("testComponent", reader.readProperty("component"));
		assertEquals("SENT", reader.readProperty("status"));
	}
	
	@Test(expected=MessageIOInitializationException.class)
	public void incorrectXMLInputThrowsException(){
		reader.init(wrongTestMessage);
	}
}
