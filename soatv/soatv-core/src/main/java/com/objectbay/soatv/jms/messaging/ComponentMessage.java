package com.objectbay.soatv.jms.messaging;

import com.objectbay.soatv.agent.NotificationMessage;
import com.objectbay.soatv.utils.MessageFieldUtils;


/**
 * Class represents messages that can be received by soatv monitor
 * from jms topic and representing action performed by some component
 * in some node (e.g. message is sent, or message is received).
 * Component messages are in their nature log messages that components
 * may sent in the log topic while performing operations with messages
 * that contain business data.
 * @author eerofeev
 *
 */
public class ComponentMessage extends NotificationMessage{
	
	public ComponentMessage(String id) {
		super(id);
	}
	
	/**
	 * Creates new message instance using ActionMessageIO
	 * @param nodeId
	 * @param componentId
	 * @return
	 */
	public static ComponentMessage createMessage(MessageIO reader){
		ComponentMessage instance = new ComponentMessage(MessageFieldUtils.cleanValue((String)reader.readProperty("id")));
		instance.setStatus(MessageFieldUtils.cleanValue((String)reader.readProperty("status")));
		instance.setNode(MessageFieldUtils.cleanValue((String)reader.readProperty("node")));
		
		Component component = new Component();
		component.setValue(MessageFieldUtils.cleanValue( ((Component)reader.readProperty("component")).getValue() ));
		component.setType(MessageFieldUtils.cleanValue( ((Component)reader.readProperty("component")).getType() ));
		instance.setComponent(component);
		
		instance.setBody(MessageFieldUtils.cleanValue((String)reader.readProperty("body")));
		return instance;
	}
}
