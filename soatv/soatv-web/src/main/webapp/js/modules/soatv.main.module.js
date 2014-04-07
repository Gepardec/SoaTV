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
			soatvVisualization.container.add("node", nodeId, {type:"jboss", header : nodeName});
		}
	};
	
	/**
	 * Adds new component to the given node represents it on tv
	 */
	soatv.addComponent = function(componentId, componentName, componentType, nodeId){
		var container = soatvVisualization.container;
		if(container.find(nodeId) == null){
			console.log("Node with the given id " + nodeId + " does not exist");
		} else {
			
			
			var node = soatvModel.nodes[nodeId];
			var component = new Component();
			component.id = componentId;
			component.name = componentName;
			component.type = componentType;
			node.addComponent(component);
			
			soatvVisualization.container.find(nodeId).add("component", componentId, {type:componentType, header : componentName});
			
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
		
		//var node = soatvVisualization.vis.nodes[soatvVisualization.vis.ids[nodeId]];
		//var parent = node.components[node.ids[componentId]];
		
		//visualize message
		message.color = serviceRandomColor.generate();
		soatvModel.topic.put(message);
		//soatvVisualization.builder.build("message",{id : messageId, color : message.color, parent : parent});
		//soatvVisualization.container.find(nodeId).find(componentId).add("message", messageId, {color : color});
	};
	
	/**
	 * Simulates the process of receiving of a  message by component from the topic
	 * @param {String} messageId id of the message
	 * @param {String} nodeId id of the node, where message is received
	 * @param {String} componentId id of the component, where the message is located
	 */
	soatv.receiveMessage = function(messageId, nodeId, componentId){
		/*var component = soatvVisualization.container.find(nodeId).find(componentId)
		
		//identify original component
		var originalComponent = soatvModel.topic.messages[messageId].component;
		// extend message with the original component to visualize message pass later
		soatvModel.topic.messages[messageId].originalComponentId = originalComponent.id;
		
		soatvModel.topic.messages[messageId].originalComponent = originalComponent;
		component.receiveMessage(soatvModel.topic.messages[messageId]);*/
		
		var messageInstance = soatvVisualization.container.find(originalComponent.node.id).find(originalComponent.id).find(messageId);
		
		//var intermediateNode = soatvVisualization.vis.nodes[0];	// topic node
		
		var destinationNode = soatvVisualization.container.find(nodeId).find(componentId);
		messageInstance.moveTo(destinationNode);
		
	};
	
	/**
	 * Shows a sent message from one application to another.
	 */
	soatv.showMessagePass = function (messageId, nodeId, componentId, body, onEnd){
		
		var message = new Message();
		message.id = messageId;
		message.node = soatvModel.nodes[nodeId];
		message.component = message.node.components[componentId];
		message.body = body;
		
		//var node = soatvVisualization.vis.nodes[soatvVisualization.vis.ids[nodeId]];
		//var parent = node.components[node.ids[componentId]];
		
		message = soatvModel.topic.put(message);
				
		var sender = message.components[message.components.length - 2];
		var receiver = message.components[message.components.length - 1];
		
		soatvVisualization.container.find(sender.node.id).find(sender.id).add("message", messageId, {color : message.color});
		
		var messageVisualComponent = soatvVisualization.container.find(sender.node.id).find(sender.id).find(messageId);
		var destination = soatvVisualization.container.find(receiver.node.id).find(receiver.id);
		
		messageVisualComponent.moveTo(destination, onEnd);
	};
	
	/**
	 * Hide a sent message from one application to another.
	 */
	soatv.hideMessagePass = function (messageId){
		/*var message = soatvModel.topic.messages[messageId];
		if(message.originalComponent != null){
			var originalComponentId = message.originalComponent.id;		
			soatvMessagePassAnimation.hideMessagePass(originalComponentId, message.component.id);
		}*/
	};
	
	return soatv;
});

soatvMainModule.factory('soatvMessageBuffer', function(){
	var buffer = {content : {}};
	
	/**
	 * Function that must perform forwarding of message for further processing,
	 * when buffer allows it
	 */
	buffer.free = null;
	
	/**
	 * Adds message into buffer
	 */
	buffer.add = function(message, messageId){
		
		if(buffer.content[messageId] == null){
			buffer.content[messageId] = {locked : true, messages :[]};
			buffer.free(message);
		} else {
			buffer.content[messageId].messages.push(message);
			if(buffer.content[messageId].locked === false){
				buffer.content[messageId].locked = true;
				buffer.free(buffer.content[messageId].messages.shift());
			}
		}
	};
	
	/**
	 * unlock next message processing
	 */
	buffer.unlock = function(messageId) {
		if(buffer.content[messageId] == null){
			return;
		}
		if(buffer.content[messageId].messages.length > 0){
			buffer.free(buffer.content[messageId].messages.shift());
		} else {
			buffer.content[messageId].locked = false;
		}
		
	};
	
	return buffer;
});