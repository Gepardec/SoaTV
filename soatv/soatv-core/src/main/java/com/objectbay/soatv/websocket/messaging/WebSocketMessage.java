package com.objectbay.soatv.websocket.messaging;

import com.objectbay.soatv.jms.messaging.MessageIO;


/**
 * Describes messaging format for web-socket messaging
 * @author eerofeev
 *
 */
public class WebSocketMessage {
	public static enum Action {
		REQUEST_INIT,					// received init message from client
		RESPONSE_NEW_NODE,				// 
		RESPONSE_NEW_COMPONENT,			// 
		RESPONSE_NEW_MESSAGE,			// first occurance of message
		RESPONSE_MESSAGE
	};
	
	/**
	 * Action to be performed
	 */
	private Action action;
	/**
	 * String representation of data that can be attached to message 
	 */
	private Object data;
	
	private WebSocketMessage(){
	}
	
	/**
	 * Creates new message using reader
	 * @return
	 */
	public static WebSocketMessage create(MessageIO reader){
		WebSocketMessage instance = new WebSocketMessage();
		instance.action = (Action)reader.readProperty("action");
		instance.data = (String) reader.readProperty("data");
		return instance;
	}
	
	/**
	 * Creates new empty
	 * @return
	 */
	public static WebSocketMessage create(){
		return new WebSocketMessage();
	}
	
	/**
	 * Sets action to the message and returns the same instance of Message
	 * @param action
	 * @return
	 */
	public WebSocketMessage action(Action action){
		setAction(action);
		return this;
	}
	
	/**
	 * Sets data string to the message and returns the same instance of Message
	 * @param action
	 * @return
	 */
	public WebSocketMessage data(String data){
		setData(data);
		return this;
	}

	public Action getAction() {
		return action;
	}

	public void setAction(Action action) {
		this.action = action;
	}

	public Object getData() {
		return data;
	}

	public void setData(Object data) {
		this.data = data;
	}
}
