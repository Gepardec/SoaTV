package com.objectbay.soatv.jms.messaging;

import java.io.IOException;
import java.io.StringReader;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Unmarshaller;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.objectbay.soatv.agent.AgentMessage.MessageStatus;
import com.objectbay.soatv.utils.CDIUtils.DefaultComponentMessageIO;
import com.objectbay.soatv.utils.MessageFieldUtils;
import com.objectbay.soatv.utils.MessageFieldUtils.MessageField;

@DefaultComponentMessageIO
@XmlRootElement(name = "message")
@XmlAccessorType(XmlAccessType.FIELD)
public class XMLComponentMessageReader implements MessageIO {

	private static Logger log = LoggerFactory
			.getLogger(XMLComponentMessageReader.class);

	@XmlElement(name = "id")
	@MessageField
	private String id;

	@XmlElement(name = "node")
	@MessageField
	private String node;

	@XmlElement(name = "component")
	@MessageField
	private String component;

	@XmlElement(name = "status")
	@MessageField
	private String status;
	
	public XMLComponentMessageReader() {
		// TODO Auto-generated constructor stub
	}

	public String getMessageId() {
		return id;
	}

	public String getMessageNode() {
		return node;
	}

	public String getMessageComponent() {
		// TODO Auto-generated method stub
		return component;
	}

	public MessageStatus getMessageStatus() {
		return MessageStatus.valueOf(status);
	}

	public static XMLComponentMessageReader getReader(String xml) {
			
		JAXBContext jc;
		try {
			jc = JAXBContext.newInstance(XMLComponentMessageReader.class);
			Unmarshaller unmarshaller = jc.createUnmarshaller();
			StringReader reader = new StringReader(xml);
			XMLComponentMessageReader xmlMessageReader = (XMLComponentMessageReader) unmarshaller
					.unmarshal(reader);

			return xmlMessageReader;
		} catch (JAXBException e) {
			log.warn("{}", e);
			throw new MessageIOInitializationException(e.getMessage());
		}

	}

	@Override
	public Object readProperty(String key) {
		return MessageFieldUtils.getFieldValue(key, this);
	}

	@Override
	public MessageIO writeProperty(String key, Object value) {
		return this;
	}

	@Override
	public Object flush() throws IOException {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public void init(Object source) {
		if(source instanceof String){
			XMLComponentMessageReader newInstance = XMLComponentMessageReader.getReader((String)source);
			MessageFieldUtils.copyProps(newInstance, this);
		}
	}

}
