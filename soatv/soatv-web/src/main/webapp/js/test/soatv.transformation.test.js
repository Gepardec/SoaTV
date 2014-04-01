process.env.NODE_ENV = 'test';

function dbg(obj) {
	var seen = [];

	return JSON.stringify(obj, function(key, val) {
		if (typeof val == "object") {
			if (seen.indexOf(val) >= 0)
				return;
			seen.push(val);
		}
		return val;
	});
}

var testCase = require('nodeunit').testCase;
var testController = null;
var transformation = null;

exports.transformationGroup = testCase({
	setUp : function setup(cb) {
		testController = new Controller();
		testController.setTopic(new MessageTopic());
		
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
		
		testController.addNode(node1);
		testController.addNode(node2);
		
		transformation = new Transformation(testController);
		
		cb();
	},
	
	transformationReturnsCorrectNodeNodes: function(test) {
		nodes = transformation.buildNodeNodes();
		test.equal(2, nodes.length);
		test.equal(testController.nodes["n2"].id, nodes[1].data.id);
		test.equal("n1", nodes[0].data.id);
		test.done();
	},
	
	transformationReturnsCorrectComponentNodes: function(test) {
		nodes = transformation.buildComponentNodes(testController.nodes["n2"]);
		test.equal(1, nodes.length);
		test.equal(testController.nodes["n2"].components["c2"].name, nodes[0].data.name);
		test.equal("c2", nodes[0].data.id);		
		test.done();
	},
	
	transformationBuildsCorrectSingleNodeNode: function(test){
		nodes = transformation.buildNodeNode(testController.nodes["n1"]);
		test.equal(2, nodes.length);
		
		test.equal(testController.nodes["n1"].name, nodes[0].data.name);
		test.equal("n1", nodes[0].data.id);
		
		test.equal(testController.nodes["n1"].components["c1"].name, nodes[1].data.name);
		test.equal("c1", nodes[1].data.id);		
		
		test.done();
	},
	
	transformationBuildsCorrectSingleComponentNode: function(test){
		componentNode = transformation.buildComponentNode(testController.nodes["n1"].components["c1"]);
		
		test.equal(testController.nodes["n1"].components["c1"].name, componentNode.data.name);
		test.equal("c1", componentNode.data.id);
		
		test.done();
	},
	
	transformationBuildsCorrectListOfAllNodes: function(test){
		nodes = transformation.buildNodes();
		test.equal(4, nodes.length);
		
		test.equal(testController.nodes["n2"].name, nodes[2].data.name);
		test.equal("n2", nodes[2].data.id);
		
		test.equal(testController.nodes["n1"].components["c1"].name, nodes[1].data.name);
		test.equal("c1", nodes[1].data.id);		
		
		test.done();
	},
	
	transformationBuildsCorrectMessage: function(test){
		var message = new Message();
		message.id = "m1";
		message.body = "";
		message.component = testController.nodes["n1"].components["c1"];
		message.node = testController.nodes["n1"];
		
		var messageNode = transformation.buildMessageNode(message, "white", {x : 100, y : 100});
		
		test.done();
	},
});