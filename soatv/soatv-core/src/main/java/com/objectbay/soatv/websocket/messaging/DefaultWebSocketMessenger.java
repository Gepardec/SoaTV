package com.objectbay.soatv.websocket.messaging;

import javax.inject.Inject;
import javax.websocket.CloseReason;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.objectbay.soatv.jms.messaging.MessageIO;
import com.objectbay.soatv.utils.CDIUtils.DefaultMessenger;
import com.objectbay.soatv.utils.CDIUtils.DefaultWebSocketMessageIO;
import com.objectbay.soatv.websocket.messaging.Messaging.MessageSender;
import com.objectbay.soatv.websocket.messaging.Messaging.Messenger;

/**
 * Default implementation of {@link Messenger} interface.
 * Messenger receives messages, analyzes them and constructs corresponding response
 * @author eerofeev
 *
 */
@DefaultMessenger
public class DefaultWebSocketMessenger implements Messenger {
	
	private static Logger log = LoggerFactory.getLogger(DefaultWebSocketMessenger.class);
	
	private MessageSender messageSender;
	
	@Inject @DefaultWebSocketMessageIO
	private MessageIO messageReader;
	
	public DefaultWebSocketMessenger() {
	}
	
	public void onMessage(String msg) {
		log.debug("Message received from client {}", msg);
		messageReader.init(msg);
		WebSocketMessage message = WebSocketMessage.create(messageReader);
		switch(message.getAction()){
		case REQUEST_INIT :
			break;
		default:
			break;
		}
	}

	public void onClose(CloseReason reason) {
		log.debug("Connection closed. Reason: {}", reason == null ? "unknown" : reason.toString());			
	}

	public void setMessageSender(MessageSender messageSender) {
		this.messageSender = messageSender;	
	}

	public MessageSender getMessageSender() {
		return messageSender;
	}

}
