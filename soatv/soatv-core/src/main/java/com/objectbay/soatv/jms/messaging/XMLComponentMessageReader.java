package com.objectbay.soatv.jms.messaging;

import java.io.IOException;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlRootElement;

import com.objectbay.soatv.agent.NotificationMessage;
import com.objectbay.soatv.utils.CDIUtils.DefaultComponentMessageIO;
import com.objectbay.soatv.utils.MessageFieldUtils;

@DefaultComponentMessageIO
@XmlRootElement(name = "message")
@XmlAccessorType(XmlAccessType.FIELD)
public class XMLComponentMessageReader implements MessageIO {

	NotificationMessage message;

	public static XMLComponentMessageReader getReader(String xml) {
			
		XMLComponentMessageReader readerInstance = new XMLComponentMessageReader();
		readerInstance.message = NotificationMessage.fromXMLString(xml);
		return readerInstance;
	}

	@Override
	public Object readProperty(String key) {
		return MessageFieldUtils.getFieldValue(key, message);
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
