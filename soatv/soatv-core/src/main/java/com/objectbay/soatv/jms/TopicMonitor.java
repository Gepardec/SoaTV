package com.objectbay.soatv.jms;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.Hashtable;
import java.util.List;
import java.util.Observer;
import java.util.Properties;
import java.util.Set;

import javax.jms.Message;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.objectbay.soatv.agent.NotificationMessage.Component;
import com.objectbay.soatv.jms.TopicMonitorEvent.TopicMonitorEventType;
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
	
	private static Logger log = LoggerFactory.getLogger(TopicMonitor.class);
	
	/**
	 * List of nodes with components
	 */
	Hashtable<String, Set<Component>> nodes;
	/**
	 * List of all components with messages
	 */
	Hashtable<String, List<ComponentMessage>> components;
	
	/**
	 * List of all messages by id
	 */
	Hashtable<String, List<ComponentMessage>> messages;
	
	/**
	 * Notification service that notifies all observers about monitor events
	 */
	Notifier notifier;
	
	public TopicMonitor() {
		nodes = new Hashtable<String, Set<Component>>();
		messages = new Hashtable<String, List<ComponentMessage>>();
		components = new Hashtable<String, List<ComponentMessage>>();
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
	public Set<Component> getNodeComponents(String name){
		if(name == null){
			return null;
		}
		
		if(!nodes.containsKey(name)){
			nodes.put(name, new HashSet<Component>());
			notifyObservers(new TopicMonitorEvent(TopicMonitorEventType.NEW_NODE, name));
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
		if(!nodeExists(nodeName)){
			return false;
		}
		for(Component c : getNodeComponents(nodeName)){
			if(c.getValue().equals(componentName)){
				return true;
			}
		}
		
		return false;
	}
	
	/**
	 * Adds new component to the given node
	 * @param nodeName
	 * @param componentName
	 */
	public void addComponent(String nodeName, Component component){
		if(!componentExists(nodeName, component.getValue())){
			getNodeComponents(nodeName).add(component);
			
			Properties props = new Properties();
			props.put("node", nodeName);
			props.put("component", component.getValue());
			props.put("type", component.getType());
			
			notifyObservers(new TopicMonitorEvent(TopicMonitorEventType.NEW_COMPONENT, props));
			components.put(nodeName + component.getValue(), new ArrayList<ComponentMessage>());
		}
	}
	
	void notifyObservers(TopicMonitorEvent event){
		notifier.notifyObservers(event);
	}
	
	/**
	 * Adds message to the topic messages.
	 * @param msg
	 */
	public void addMessage(ComponentMessage msg){
		if(msg == null){
			log.warn("Null message can not be added");
			return;
		}
		
		String id = msg.getId();
		
		if(id == null){
			log.warn("Message with null id can not be added");
			return;
		}
		
		if(!componentExists(msg.getNode(), msg.getComponent().getValue())){
			addComponent(msg.getNode(), msg.getComponent());
		}
		
		//if it is first message
		if(!containsMessages(id)){
			messages.put(id, new ArrayList<ComponentMessage>());
			notifyObservers(new TopicMonitorEvent(TopicMonitorEventType.NEW_MESSAGE, msg));
		} else {
			notifyObservers(new TopicMonitorEvent(TopicMonitorEventType.MESSAGE, msg));
		}
		
		messages.get(id).add(msg);
		components.get(msg.getNode() + msg.getComponent().getValue()).add(msg);
		
		
	}
	
	/**
	 * Returns List of messages with the given id
	 * @param id
	 */
	public List<ComponentMessage> getMessages(String id){		
		return messages.get(id);
	}
		
	/**
	 * Identifies whether messages with the given id already exist
	 * @param id
	 * @return
	 */
	public boolean containsMessages(String id){
		return id != null && messages.get(id) != null;
	}
		
	/**
	 * Abstract message listener that is invoked when new message is registered in topic
	 */
	public abstract void onMessage(Message message);
}
