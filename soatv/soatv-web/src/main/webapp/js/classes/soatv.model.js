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
	this.components = [];
	this.node = null;				// current node
	this.component = null;			// current component
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
	this.messages = {};	// maps messageId->messageIndex in ordered messages
	this.orderedMessages = [];
	this.node = null;
	this.name = null;
	this.type = null;

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

			this.orderedMessages.push(message);
			this.messages[message.id] = this.orderedMessages.length - 1;

		message.components.push(this);
		
		var indexOfReceiver = message.components.length - 1;
		//if it is first node of message
		if(indexOfReceiver === 0){
			this.node.controller.notification.notify(Controller.EVENT_COMPONENT_CREATED_MESSAGE, {component : this, message : message});
		} else {
			this.node.controller.notification.notify(Controller.EVENT_COMPONENT_RECEIVED_MESSAGE, {component : this, message : message});
			//this.node.controller.notification.notify(Controller.EVENT_COMPONENT_RECEIVED_MESSAGE, {component : message.nodes[indexOfReceiver-1], message : message});
		}
	
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
	 * Puts the message into the topic and returns actiual instance of message
	 */
	MessageTopic.prototype.put = function(message) {
		if(this.messages[message.id] == null){
			this.messages[message.id] = message;
			this.orderedMessages.unshift(message);
			this.controller.notification.notify(Controller.EVENT_TOPIC_ADDED_MESSAGE, {message : message});
			message.component.addMessage(message);
			return message;
		} else {
			// add existing instance
			message.component.addMessage(this.messages[message.id]);
			this.messages[message.id].body = message.body;
			return this.messages[message.id];
		}
		
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
