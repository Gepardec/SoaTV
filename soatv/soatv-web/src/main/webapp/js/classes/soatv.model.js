/* soatv-model.js */

/**
 * =======================================================================
 * Utilities
 * =======================================================================
 */

// Array Remove - By John Resig (MIT Licensed)
/*Array.prototype.remove = function(from, to) {
	var rest = this.slice((to || from) + 1 || this.length);
	this.length = from < 0 ? this.length + from : from;
	return this.push.apply(this, rest);
};*/

/**
 * Main object
 */
var mainController;

// (function(window) {
// "use strict";

/**
 * =======================================================================
 * Classes
 * =======================================================================
 */

/**
 * Class represents notification functionality for applications and queue
 */
Notification = function() {
	this.listeners = {}; // list of listeners for incoming messages
	
	/**
	 * Register listener that will react on given event. Listener is a function with one
	 * argument, that represents some object to be passed to the listener.
	 */
	Notification.prototype.registerListener = function(event, listener) {
		if(event != null){
			if(this.listeners[event] == undefined){
				this.listeners[event] = [listener];
			} else {
				this.listeners[event].push(listener);
			}
		}
	};

	/**
	 * Clear all listeners
	 */
	Notification.prototype.clearListeners = function() {
		this.listeners = {};
	};
	
	/**
	 * Notify all listeners
	 */
	Notification.prototype.notify = function(event, object) {
		if(this.listeners[event] != null){
			this.listeners[event].forEach(function(listener) {
				listener(object);
			});
		}
	};
};

/**
 * Class represents messages on components
 */
Message = function() {

	Message.STATUS_CREATED = 1;		//	created on some component
	Message.STATUS_RECEIVED = 2;	//	received by another component

	this.body = null;
	this.id = null;
	this.component = null;
	this.node = null;
	this.status = 0;
	
	/**
	 * Checks whether the given status is presented
	 */
	Message.prototype.hasStatus = function(status){
		return ((this.status & status) > 0);
	};
	
	/**
	 * Set given status.
	 */
	Message.prototype.setStatus = function(status){
		this.status = this.status | status;
	};
};

/**
 * Class represents component that can be deployed on node and can send and
 * receive messages.
 */
Component = function() {	
	this.id = null;
	this.messages = {};
	this.node = null;
	this.name = null;

	/**
	 * Adds message to the message pool
	 * 
	 * @param event
	 *            event that fired while message adding
	 * @param message
	 *            instance of Message
	 * @returns
	 */
	Component.prototype.addMessage = function(message) {
		message.setStatus(Message.STATUS_CREATED);
		this.messages[message.id] = message;
		this.node.controller.notification.notify(Controller.EVENT_COMPONENT_CREATED_MESSAGE, {component : this, message : message});
	};
	
	/**
	 * Removes message with the given id
	 */
	Component.prototype.removeMessage = function(messageId) {
		delete this.messages[messageId];
	};
	
	/**
	 * Receives message from the topic and also deletes it from the previous component
	 * @param message
	 */
	Component.prototype.receiveMessage = function(message) {
		message.node = this.node;
		message.component = this;
		this.messages[message.id] = message;
		message.setStatus(Message.STATUS_RECEIVED);
		this.node.controller.notification.notify(Controller.EVENT_COMPONENT_RECEIVED_MESSAGE, {component : this, message : message});
	};
	
	Component.prototype.getNumberOfMessages = function(){
		return Object.keys(this.messages).length;
	};
};

/**
 * Class represents topic of messages
 * 
 * @returns {MessageQueue}
 */
MessageTopic = function() {
	
	this.messages = {};
	this.orderedMessages = [];
	this.controller = null;

	/**
	 * Puts the message into the queue. This is the start of message life cycle
	 */
	MessageTopic.prototype.put = function(message) {
		this.messages[message.id] = message;
		this.orderedMessages.unshift(message);
		this.controller.notification.notify(Controller.EVENT_TOPIC_ADDED_MESSAGE, {message : message});
	
		message.component.addMessage(message);
	};

};

/**
 * Class represent node that may have multiple components deployed.
 * 
 * @returns {Node}
 */
Node = function() {
	this.components = {}; // list of all components deployed on node
	this.controller = null;
	this.id = null;
	this.name = null;

	/**
	 * Adds new component to the Host object and returns its id
	 */
	Node.prototype.addComponent = function(component) {
		this.components[component.id] = component;
		component.node = this;
	};

	/**
	 * Removes component with the given id from Node object
	 */
	Node.prototype.removeComponent = function(componentId) {
		this.components[componentId].node = null;
		delete this.components[componentId];
	};
};

/**
 * Controller class. Provides control of nodes and components
 * 
 */
Controller = function() {
	this.nodes = {}; // list of all hosts
	this.topic;
	this.notification = new Notification();
	
	Controller.EVENT_TOPIC_ADDED_MESSAGE = "event_topic_added_message";			// add message in topic
	Controller.EVENT_COMPONENT_CREATED_MESSAGE = "event_component_created_message";		// create message
	Controller.EVENT_COMPONENT_RECEIVED_MESSAGE = "event_component_received_message";		// read message from topic

	/**
	 * Sets topic to controller object
	 */
	Controller.prototype.setTopic = function(topic) {
		this.topic = topic;
		topic.controller = this;
	};
	
	/**
	 * Adds new node to the Controller object and returns its id
	 */
	Controller.prototype.addNode = function(node) {
		this.nodes[node.id] = node;
		node.controller = this;
	};

	/**
	 * Removes node with the given id from Controller object
	 */
	Controller.prototype.removeNode = function(nodeId) {
		delete this.nodes[nodeId];
	};
	
	/**
	 * Returns Component instance by node id and component id
	 */
	Controller.prototype.getComponent = function(nodeId, componentId){
		return this.nodes[nodeId] == null ? null : this.nodes[nodeId].components[componentId];
	};
};

// })(window);
