process.env.NODE_ENV = 'test';

var testCase = require('nodeunit').testCase;
var mainController = new Controller();
mainController.setTopic(new MessageTopic());
 
exports.modelGroup = testCase({
	
	setUp : function setup(cb) {		
		cb();
	},
	
	messagesWorkCorrectly : function (test){
		var msg = new Message();
		test.equal(false, msg.hasStatus(Message.STATUS_CREATED));
		msg.setStatus(Message.STATUS_CREATED);
		
		test.equal(true, msg.hasStatus(Message.STATUS_CREATED));
		test.equal(false, msg.hasStatus(Message.STATUS_RECEIVED));
		test.done();
	},

	topicProvidesCorrectBehaviour : function (test){
		
		var node = new Node();
		node.id = "node1";
		
		var component = new Component();
		component.id = "component1";
		
		node.addComponent(component);
		
		mainController.addNode(node);
		
		var m1 = new Message();
		m1.text = "text1";
		m1.id = "m1";
		m1.node = node;
		m1.component = component;
		
		var m2 = new Message();
		m2.text = "text2";
		m2.id = "m2";
		m2.node = node;
		m2.component = component;
		
		var topic = mainController.topic;
		topic.put(m1);
		topic.put(m2);
		
		test.notEqual(null, topic.messages["m1"]);
		test.notEqual(null, topic.messages["m2"]);
		
		test.equal("text1", topic.messages["m1"].text);		
		test.equal("text2", topic.messages["m2"].text);
		
		test.done();
	},

	nodeCorrectlyAddsAndRemovesComponent: function (test){
		
		var node = new Node();
		node.id = "node1";
		
		var component = new Component();
		component.id = "component1";
		
		node.addComponent(component);
		
		test.notEqual(null, node.components[component.id]);
		test.equal(node, component.node);
		
		node.removeComponent("component1");
		
		test.equal(null, node.components[component.id]);
		test.done();
	},

	listenerProvidesCorrectBehaviour: function (test){
		
		var listened = false;
		
		var node = new Node();
		node.id = "node1";
		
		var component = new Component();
		component.id = "component1";
		
		node.addComponent(component);
		mainController.addNode(node);
		
		var message = new Message();
		message.node = node;
		message.component = component;
		message.id = "m1";
		message.text = "text1";
		
		mainController.notification.registerListener(Controller.EVENT_COMPONENT_CREATED_MESSAGE, function(message){listened = true;});
		
		test.equal(false, listened);
		mainController.topic.put(message);
		
		test.equal(true, listened);
		
		test.notEqual(null, component.messages[message.id]);
		test.equal(node, component.node);
		
		test.done();
	},

	messageTravelingCycleIsCorrect: function (test){
		
		var node1 = new Node();
		node1.id = "n1";
		var node2 = new Node();
		node2.id = "n2";
		
		var component1 = new Component();
		var component2 = new Component();
		component1.id = "c1";
		component2.id = "c2";
		
		node1.addComponent(component1);
		node2.addComponent(component2);
		
		mainController.addNode(node1);
		mainController.addNode(node2);
		
		test.equal(node1, mainController.nodes["n1"]);
		
		var msg = new Message();
		msg.txt = "text";
		msg.id = "m";
		msg.node = mainController.nodes["n1"];
		msg.component = mainController.getComponent("n1", "c1");
		
		test.equal(component1, mainController.getComponent("n1", "c1"));
		
		var created = false;
		var received = false;
		
		mainController.notification.registerListener(Controller.EVENT_COMPONENT_CREATED_MESSAGE, function(message){created = true;});
		mainController.notification.registerListener(Controller.EVENT_COMPONENT_RECEIVED_MESSAGE, function(message){received = true;});
		
		mainController.topic.put(msg);
		test.equal(true, created);
		
		test.equal(true, msg.hasStatus(Message.STATUS_CREATED));
		test.equal(false, msg.hasStatus(Message.STATUS_RECEIVED));
		
		test.equal(1, component1.getNumberOfMessages());
		test.equal(0, component2.getNumberOfMessages());
		
		component2.receiveMessage(msg);
		
		test.equal(1, component1.getNumberOfMessages());
		test.equal(1, component2.getNumberOfMessages());
		
		test.equal(true, received);
		test.equal(true, msg.hasStatus(Message.STATUS_RECEIVED));
		
		component1.removeMessage(msg.id);
		
		test.equal(0, component1.getNumberOfMessages());
		test.equal(1, component2.getNumberOfMessages());
		
		test.done();
	}
});