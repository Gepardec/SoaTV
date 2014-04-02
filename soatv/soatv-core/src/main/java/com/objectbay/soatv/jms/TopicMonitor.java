package com.objectbay.soatv.jms;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Observer;
import java.util.Set;

import javax.jms.Message;

import com.objectbay.soatv.agent.AgentMessage.MessageStatus;
import com.objectbay.soatv.jms.messaging.ComponentMessage;
import com.objectbay.soatv.utils.Notifier;

/**
 * Monitors messaging topic and forwards corresponding events to messaging
 * context. Monitor can also serve as filter and forward only messages
 * of particular format. Normally one monitor per messaging context.
 * @author eerofeev
 *
 */
public abstract class TopicMonitor {
	
	/**
	 * List of nodes with components
	 */
	Map<String, Set<String>> nodes;
	/**
	 * List of all received messages
	 */
	Map<MessageStatus, Map<String, ComponentMessage>> messages;
	
	/**
	 * Notification service that notifies all observers about monitor events
	 */
	Notifier notifier;
	
	public TopicMonitor() {
		nodes = new HashMap<String, Set<String>>();
		messages = new HashMap<MessageStatus, Map<String, ComponentMessage>>();
		notifier = new Notifier();
	}
	
	/**
	 * Adds listener of monitor events
	 * @param listener
	 */
	public void addListener(Observer listener){
		notifier.addObserver(listener);
	}
	
	/**
	 * Removes registered listener
	 * @param listener
	 */
	public void removeListener(Observer listener){
		notifier.deleteObserver(listener);
	}
	
	/**
	 * Gets list of components deployed on the node.
	 * If given node does not exist, it will be created.
	 * @param name
	 * @return
	 */
	public Set<String> getNodeComponents(String name){
		if(name == null){
			return null;
		}
		
		if(!nodes.containsKey(name)){
			nodes.put(name, new HashSet<String>());
		}
		
		return nodes.get(name);
	}
	
	/**
	 * Determines whether the given node exists
	 * @param name
	 * @return
	 */
	public boolean nodeExists(String name){
		return nodes.get(name) != null;
	}
	
	/**
	 * Determine whether the given components is presented on the given Node
	 * @param nodeName
	 * @param componentName
	 * @return
	 */
	public boolean componentExists(String nodeName, String componentName){
		return (nodeExists(nodeName) && getNodeComponents(nodeName).contains(componentName));
	}
	
	/**
	 * Adds new component to the given node
	 * @param nodeName
	 * @param componentName
	 */
	public void addComponent(String nodeName, String componentName){
		if(!componentExists(nodeName, componentName)){
			getNodeComponents(nodeName).add(componentName);
		}
	}
	
	void notifyObservers(TopicMonitorEvent event){
		notifier.notifyObservers(event);
	}
	
	/**
	 * Adds message to the topic messages if the message with the given
	 * id does not exist
	 * @param msg
	 */
	public void addMessage(ComponentMessage msg){
		if(!messages.containsKey(msg.getStatus())){
			messages.put(msg.getStatus(), new HashMap<String, ComponentMessage>());
			messages.get(msg.getStatus()).put(msg.getId(), msg);
		} else {
			Map<String, ComponentMessage> statusMessages = messages.get(msg.getStatus());
			if(!statusMessages.containsKey(msg.getId())){
				statusMessages.put(msg.getId(), msg);
			}
		}
	}
	
	/**
	 * Returns List of messages with the given id
	 * @param id
	 */
	public List<ComponentMessage> getMessages(String id){
		List<ComponentMessage> result = new ArrayList<ComponentMessage>();
		for(MessageStatus key : messages.keySet()){
			Map<String, ComponentMessage> msgs = messages.get(key);
			ComponentMessage candidate = msgs.get(id);
			if(candidate != null){
				result.add(candidate);
			}
		}
		
		return result;
	}
	
	/**
	 * Identifies whether topic contains message with the given id and status
	 * @param status
	 * @param id
	 * @return
	 */
	public boolean containsMessage(MessageStatus status, String id){
		if(messages.get(status) == null){
			return false;
		}
		
		return messages.get(status).containsKey(id);
	}
	
	/**
	 * Returns message instance with the given status and id, if exists
	 * @param status
	 * @param id
	 * @return
	 */
	public ComponentMessage getMessage(MessageStatus status, String id){
		if(messages.get(status) == null){
			return null;
		}
		
		return messages.get(status).get(id);
	}
	
	/**
	 * Abstract message listener that is invoked when new message is registered in topic
	 */
	public abstract void onMessage(Message message);
}
