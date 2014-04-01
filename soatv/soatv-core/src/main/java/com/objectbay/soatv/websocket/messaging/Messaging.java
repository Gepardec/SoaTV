package com.objectbay.soatv.websocket.messaging;

import java.io.IOException;

import javax.inject.Named;
import javax.websocket.CloseReason;

/**
 * Common websocket messaging interface
 * @author eerofeev
 *
 */
public interface Messaging {

	/**
	 * Message sender interface used at web-socket connection.
	 * @author eerofeev
	 *
	 */
	public interface MessageSender {
		/**
		 * Sends message to remote client via web-socket
		 * @param msg <code>String</code>-representation of message
		 * @throws IOException
		 */
		public void sendMessage(String msg) throws IOException;
	}

	/**
	 * Messenger interface used at web-socket connection to send and receive messages
	 * @author eerofeev
	 *
	 */
	@Named
	public interface Messenger {
		
		/**
		 * Callback invoked when client side receives a web-socket message
		 * from client.
		 * @param msg <code>String</code>-representation of received message
		 */
		public void onMessage(String msg);
		
		/**
		 * Callback invoked when web-socket connection is being closed
		 */
		public void onClose(CloseReason reason);
		
		public void setMessageSender(MessageSender messageSender);
		
		public MessageSender getMessageSender();
		
	}
	
}
