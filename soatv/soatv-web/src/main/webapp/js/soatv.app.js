// define main module
//var soatv = angular.module('soatv',[]);

var mock = {};

mock.actions = [
                function(){mock.soatv.addNode("Money_Host", "Money_Host");},
                function(){mock.soatv.addNode("DB_Host", "DB_Host");},
                function(){mock.soatv.addNode("Mail_Host", "Mail_Host");},
                
                function(){mock.soatv.addComponent("Money1", "Money1", "Money_Host");},
                function(){mock.soatv.addComponent("Money2", "Money2", "Money_Host");},
                
                function(){mock.soatv.addComponent("DB1", "DB1", "DB_Host");},
                function(){mock.soatv.addComponent("DB2", "DB2", "DB_Host");},
                
                function(){mock.soatv.addComponent("Mail1", "Mail1", "Mail_Host");},
                function(){mock.soatv.addComponent("Mail2", "Mail2", "Mail_Host");},
                
                /*function(){mock.soatv.addNode("Money_Host2", "Money_Host2");},
                function(){mock.soatv.addNode("DB_Host2", "DB_Host2");},
                function(){mock.soatv.addNode("Mail_Host2", "Mail_Host2");},*/
                
                /*function(){mock.soatv.addComponent("Money3", "Money3", "Money_Host2");},
                function(){mock.soatv.addComponent("Money4", "Money4", "Money_Host2");},
                
                function(){mock.soatv.addComponent("DB3", "DB3", "DB_Host2");},
                function(){mock.soatv.addComponent("DB4", "DB4", "DB_Host2");},
                
                function(){mock.soatv.addComponent("Mail3", "Mail3", "Mail_Host2");},
                function(){mock.soatv.addComponent("Mail4", "Mail4", "Mail_Host2");},*/
                ];

// messages to be simulated
mock.messages = [];

// fromHost, fromApplication, toHost, toApplication, text, sleppAfterSend
//mock.messages.push(["Money_Host", "Money1", "DB_Host", "DB1", "Money1->DB1", 1000]);
mock.messages.push(["Money_Host", "Money2", "Mail_Host", "Mail1", "Money1->Mail1", 1000]);
/*mock.messages.push(["Mail_Host", "Mail1", "Money_Host", "Money1", "Mail1->Money1", 1000]);
mock.messages.push(["Mail_Host", "Mail2", "Money_Host", "Money2", "Mail2->Money2", 1000]);*/
mock.messages.push(["DB_Host", "DB2", "Mail_Host", "Mail2", "DB2->Mail2", 1000]);
mock.messages.push(["DB_Host", "DB1", "Money_Host", "Money1", "DB1->DB2", 1000]);

/*mock.messages.push(["Money_Host2", "Money3", "DB_Host2", "DB3", "Money3->DB3", 1000]);
mock.messages.push(["DB_Host2", "DB3", "Mail_Host2", "Mail3", "DB3->Mail3", 1000]);
mock.messages.push(["Mail_Host2", "Mail3", "Money_Host2", "Money3", "Mail3->Money3", 1000]);
mock.messages.push(["Mail_Host2", "Mail4", "Money_Host2", "Money4", "Mail4->Money4", 1000]);
mock.messages.push(["DB_Host2", "DB4", "Mail_Host2", "Mail4", "DB4->Mail4", 1000]);
mock.messages.push(["Money_Host2", "Money4", "DB_Host2", "DB4", "Money4->DB4", 1000]);*/

mock.currentAction = 0;
mock.currentMessage = 0;
mock.createdMessages = false;

mock.nextNode = function(){
	if(mock.currentAction < mock.actions.length){
		mock.actions[mock.currentAction]();
		mock.currentAction++;
	}
};

mock.createNextMessage = function(){
	if(mock.currentMessage < mock.messages.length){
		mock.soatv.createNewMessage(
				"m"+mock.currentMessage,
				mock.messages[mock.currentMessage][0],
				mock.messages[mock.currentMessage][1],
				mock.messages[mock.currentMessage][4]
		);
		mock.currentMessage++;
	} else {
		mock.currentMessage = 0;
		mock.createdMessages = true;
	}
};

mock.receiveNextMessage = function(){
	if(mock.currentMessage < mock.messages.length){
		mock.soatv.receiveMessage(
				"m"+mock.currentMessage,
				mock.messages[mock.currentMessage][2],
				mock.messages[mock.currentMessage][3]
		);
		mock.currentMessage++;
	}
};

var soatvApp = angular.module('soatvApp',
		[ 'soatvMainModule', 'soatvVisualizationModule' ]);

/**
 * Filter to display messages in queue in reversed order
 */
soatvApp.filter('reverse', function() {
	return function(items) {
		return items.slice().reverse();
	};
});

soatvApp.controller("MainCtrl", function($scope, soatv, soatvModel, soatvVisualization, soatvVisualizationProperties, soatvConnection) {
	mock.soatv = soatv;
	$scope.topic = soatvModel.topic.orderedMessages;
	
	$scope.connection = soatvConnection;
	$scope.connection.message = soatvConnection.getMessage();
	$scope.connection.imageLink = soatvConnection.getImageLink();
	
	$scope.nextAction = function() {
		if(!mock.createdMessages){
			mock.createNextMessage();
		} else {
			mock.receiveNextMessage();
		}
	};
	
	$scope.nextNode = function(){
		mock.nextNode();
	};
	
	$scope.showMessagePass = function(messageId){
		soatv.showMessagePass(messageId);
	};
	
	$scope.hideMessagePass = function(messageId){
		soatv.hideMessagePass(messageId);
	};
	
	$scope.toggleConnection = function(){
		if(webSocket.opened === false){
			$scope.connection.connected = null;
			$scope.connection.message = soatvConnection.getMessage();
			$scope.connection.imageLink = soatvConnection.getImageLink();
			webSocket.addListener(soatvApp);
			webSocket.connect("soatv");
		} else {
			webSocket.close();
		}
	};
	
	$scope.newTest = function(){
		nodes = [];
		nodes.push({group : "nodes", data : {id : "node1", name : "node1", displayName : "node1"}, classes : "node"});
		nodes.push({group : "nodes", data : {id : "node2", name : "node2", displayName : "node1"}, classes : "node"});
		nodes.push({group : "nodes", data : {id : "node3", name : "node3", displayName : "node1"}, classes : "node"});
		
		nodes.push({group : "nodes", data : {id : "component1", name : "component1", parent : "node1"}, classes : "component", selectable : true});
		nodes.push({group : "nodes", data : {id : "component2", name : "component2", parent : "node1"}, classes : "component", selectable : true});
		
		nodes.push({group : "nodes", data : {id : "component3", name : "component3", parent : "node2"}, classes : "component", selectable : true});
		nodes.push({group : "nodes", data : {id : "component4", name : "component4", parent : "node2"}, classes : "component", selectable : true});
		
		nodes.push({group : "nodes", data : {id : "component5", name : "component5", parent : "node3"}, classes : "component", selectable : true});
		nodes.push({group : "nodes", data : {id : "component6", name : "component6", parent : "node3"}, classes : "component", selectable : true});
		
		//nodes.push(;
		
		soatvVisualization.cy.add(nodes);
		soatvVisualization.cy.layout(soatvLayoutProperties.circle);
		
		setTimeout(function(){
			var pos = soatvVisualization.cy.elements("node#component1")[0].position();
			soatvVisualization.cy.add([{group : "nodes", data : {id : "message1", name : "message1", parent : "component1"}, classes : "message", selectable : false, position : {x : pos.x , y : pos.y}}]);
			
			soatvVisualization.cy.add([{group : "nodes", data : {id : "message2", name : "message2", parent : "component1"}, classes : "message", css : {"background-color" : "red", "border-color" : "black", "border-width" : "1px"}, position : {x : pos.x + 10, y : pos.y}}]);

		}, 1000);
		
				
	};
	
	/**
	 * Invoked when web-socket receives a message from server
	 */
	soatvApp.onmessage = function (message){
		
		// add new host
		if(message.action === "RESPONSE_NEW_NODE"){
			soatv.addNode(message.data, message.data);
		};
		
		// add new application
		if(message.action === "RESPONSE_NEW_COMPONENT"){
			soatv.addComponent(message.data.component, message.data.component, message.data.node);
		};
		
		// add new message
		if(message.action === "RESPONSE_MESSAGE_SENT"){
			soatv.createNewMessage(
					message.data.id,
					message.data.senderNodeId,
					message.data.senderComponentId
			);
		};
		
		// receive message
		if(message.action === "RESPONSE_MESSAGE_RECEIVED"){
			soatv.receiveMessage(
					message.data.id,
					message.data.senderNodeId,
					message.data.senderComponentId
			);
		};
	};
	
	/**
	 * Invoked when web-socket is open
	 */
	soatvApp.onopen = function (){
		$scope.$apply(function(){
			$scope.connection.connected = true;
			$scope.connection.message = $scope.connection.getMessage();
			$scope.connection.imageLink = $scope.connection.getImageLink();
		});
	};
	
	/**
	 * Invoked when web-socket is closed
	 */
	soatvApp.onclose = function (){
		$scope.$apply(function(){
			$scope.connection.connected = false;
			$scope.connection.message = $scope.connection.getMessage();
			$scope.connection.imageLink = $scope.connection.getImageLink();
		});
	};
	
	/*$scope.queue = soatvQueueVisualization;
	$scope.msgs = [];*/
});

soatvApp.directive('soatvTv', function(/*soatv,*/ soatvVisualization) {
	return {
		restrict : 'A', // attribute only
		link : function(scope, elem, attr, ctrl) {
			elem[0].id = "soatv";
			soatvVisualization.init(elem[0]);
		}
	};
});
