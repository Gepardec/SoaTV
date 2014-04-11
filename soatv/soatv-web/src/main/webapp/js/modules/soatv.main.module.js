/**
 * SoaTV provides basic manipulations with model and visualization and takes the role of middle layer between them
 */

var soatvMainModule = angular.module('soatvMainModule', ['soatvVisualizationModule', 'soatvModelModule', 'soatvPropertiesModule']);

/**
 * Factory creates singles instance of main module that can be injected into application
 */
soatvMainModule.factory('soatv', function(
		soatvVisualization,
		soatvModel,
		soatvVisualizationProperties,
		serviceRandomColor) {
	var soatv = {};
	
	/**
	 * Adds new node with the id given id and name and represents it on tv
	 */
	soatv.addNode = function(nodeId, nodeName){
		if(soatvModel.nodes[nodeId] != null){
			console.log("Node with the given id " + nodeId + " already exists");
		} else {
			var node = new Node();
			node.id = nodeId;
			node.name = nodeName;
			soatvModel.addNode(node);
			soatvVisualization.get('tv').container.add("node", nodeId, {type:"jboss", header : nodeName});
		}
	};
	
	/**
	 * Adds new component to the given node represents it on tv
	 */
	soatv.addComponent = function(componentId, componentName, componentType, nodeId){
		var container = soatvVisualization.get('tv').container;
		if(container.find(nodeId) == null){
			console.log("Node with the given id " + nodeId + " does not exist");
		} else {
			
			
			var node = soatvModel.nodes[nodeId];
			var component = new Component();
			component.id = componentId;
			component.name = componentName;
			component.type = componentType;
			node.addComponent(component);
			
			soatvVisualization.get('tv').container.find(nodeId).add("component", componentId, {type:componentType, header : componentName});
			
		}
	};
	
	
	/**
	 * Creates new message in topic and on the component (simulates the process of sending a message to the topic by component)
	 * @param {String} messageId id of the message
	 * @param {String} nodeId id of the node, where message is created
	 * @param {String} componentId id of the component, where the message is located
	 * @param {String} body body of the message
	 */
	soatv.createNewMessage = function(messageId, nodeId, componentId, body){
		var message = new Message();
		message.id = messageId;
		message.node = soatvModel.nodes[nodeId];
		message.component = message.node.components[componentId];
		message.body = body;
		
		//visualize message
		message.color = serviceRandomColor.generate();
		soatvModel.topic.put(message);
	};
	
	/**
	 * Shows a sending message process from one component to another.
	 */
	soatv.showMessagePass = function (messageId, nodeId, componentId, body, onEnd){
		
		var message = new Message();
		message.id = messageId;
		message.node = soatvModel.nodes[nodeId];
		message.component = message.node.components[componentId];
		message.body = body;
		
		// puts message in the topic and received actual instance (if the same id already exists)
		message = soatvModel.topic.put(message);
				
		var sender = message.components[message.components.length - 2];
		var receiver = message.components[message.components.length - 1];
		
		soatvVisualization.get('tv').container
		.find(sender.node.id)
		.find(sender.id)
		.add("message", messageId, {color : message.color});
		
		var messageVisualComponent = soatvVisualization.get('tv').container
		.find(sender.node.id)
		.find(sender.id)
		.find(messageId);
		
		var destination = soatvVisualization.get('tv').container
		.find(receiver.node.id)
		.find(receiver.id);
		
		messageVisualComponent.moveTo(destination, onEnd);
	};
	
	return soatv;
	
});

/**
 * Service that provides message buffering. If message with the same id walking from one component
 * to another to fast, this can't be visualized directly (message with the same id is moved simultaneously
 * along multiple paths). Service allows to visulize such pass in the given sequence
 */
soatvMainModule.factory('soatvMessageBuffer', function(){
	var buffer = {content : {}};
	
	/**
	 * Set of abstract functions that must perform forwarding of message for further processing,
	 * when buffer allows it. Function is invoked when buffer identifies, that next message pass can be visualized
	 * (e.g. if message is added in the empty buffer, or on processing next message in the queue)
	 */
	buffer.next = {};
	
	/**
	 * Adds message into buffer
	 */
	buffer.add = function(message, messageId){
		
		if(buffer.content[messageId] == null){
			buffer.content[messageId] = {locked : true, messages :[]};
			buffer.next[messageId](message);
		} else {
			buffer.content[messageId].messages.push(message);
			if(buffer.content[messageId].locked === false){
				buffer.content[messageId].locked = true;
				buffer.next[messageId](buffer.content[messageId].messages.shift());
			}
		}
	};
	
	/**
	 * unlock next message processing. Must be called explicitly when current message pass visualization ends.
	 */
	buffer.unlock = function(messageId) {
		if(buffer.content[messageId] == null){
			return;
		}
		if(buffer.content[messageId].messages.length > 0){
			buffer.next[messageId](buffer.content[messageId].messages.shift());
		} else {
			buffer.content[messageId].locked = false;
		}
		
	};
	
	return buffer;
});