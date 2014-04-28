/*Testing mocks code begin*/
var mock = {};

mock.actions = [
                function(){mock.soatv.addNode("Money_Host", "Money_Host");},
                function(){mock.soatv.addNode("DB_Host", "DB_Host");},
                function(){mock.soatv.addNode("Mail_Host", "Mail_Host");},
                
                function(){mock.soatv.addComponent("Money1", "Money1", "bean", "Money_Host");},
                function(){mock.soatv.addComponent("Money2", "Money2", "bean", "Money_Host");},
                
                function(){mock.soatv.addComponent("DB1", "DB1", "bean", "DB_Host");},
                function(){mock.soatv.addComponent("DB2", "DB2", "bean", "DB_Host");},
                
                function(){mock.soatv.addComponent("Mail1", "Mail1", "java", "Mail_Host");},
                function(){mock.soatv.addComponent("Mail2", "Mail2", "java", "Mail_Host");},
         
                ];

// messages to be simulated
mock.messages = [];

mock.messages.push(["Money_Host", "Money2", "Mail_Host", "Mail1", "Money1->Mail1", 1000]);
mock.messages.push(["DB_Host", "DB2", "Mail_Host", "Mail2", "DB2->Mail2", 1000]);
mock.messages.push(["DB_Host", "DB1", "Money_Host", "Money1", "DB1->DB2", 1000]);

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
				mock.messages[mock.currentMessage][4],
				""
		);
		mock.currentMessage++;
	} else {
		mock.currentMessage = 0;
		mock.createdMessages = true;
	}
};

mock.receiveNextMessage = function(){
	if(mock.currentMessage < mock.messages.length){
		mock.soatv.showMessagePass(
				"m"+mock.currentMessage,
				mock.messages[mock.currentMessage][2],
				mock.messages[mock.currentMessage][3],
				""
		);
		mock.currentMessage++;
	}
};

/*Testing mocks code end*/

var soatvApp = angular.module('soatvApp',
		[ 'soatvMainModule', 'soatvVisualizationModule' ]);

soatvApp.controller("MainCtrl", function($scope,
		soatv,
		soatvModel,
		soatvVisualization,
		soatvVisualizationProperties,
		soatvConnection,
		soatvMessageBuffer
		) {
	
	mock.soatv = soatv;	//main module
	$scope.topic = soatvModel.topic.orderedMessages;	// messages to be visualized
	
	$scope.connection = soatvConnection;				// connection visualizer
	$scope.connection.message = soatvConnection.getMessage();
	$scope.connection.imageLink = soatvConnection.getImageLink();
	
	// what is showing currently
	$scope.isShowing = "visualization";
	
	// what must be shown
	$scope.changeShowing = function(desired){
		if($scope.isShowing !== desired){
			$scope.isShowing = desired;
		}
	};
	
	$scope.onMessageClick = function(messageId){
		$scope.changeShowing("history");
		soatv.showMessageHistory(messageId);
	};
	
	/*Testing mocks code start*/
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
	
	/*Testing mocks code end*/
	
	$scope.toggleConnection = function(){	//switches connection
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
	
	
	/**
	 * Invoked when web-socket receives a message from server
	 */
	soatvApp.onmessage = function (message){
		
		/**
		 * Function that is invoked when message pass finishes
		 */
		var onMessagePassEnd = function(){
			soatvMessageBuffer.unlock(message.data.id);
		};
		
		/**
		 * Function that processes next message in the buffer, when buffer signals
		 */
		var next = function (message){
			$scope.$apply(function(){soatv.showMessagePass(
					message.data.id,
					message.data.node,
					message.data.component.value,
					message.data.body,
					onMessagePassEnd
			);
			});
		};
		
		soatvMessageBuffer.next[message.data.id] = next;
		
		// add new host
		if(message.action === "RESPONSE_NEW_NODE"){
			soatv.addNode(message.data, message.data);
		};
		
		// add new application
		if(message.action === "RESPONSE_NEW_COMPONENT"){
			soatv.addComponent(message.data.component, message.data.component, message.data.type, message.data.node);
		};
		
		// add new message
		if(message.action === "RESPONSE_NEW_MESSAGE"){
			$scope.$apply(function(){soatv.createNewMessage(
					message.data.id,
					message.data.node,
					message.data.component.value,
					message.data.body
			);
			});
		};
		
		// receive message
		if(message.action === "RESPONSE_MESSAGE"){
				soatvMessageBuffer.add(message, message.data.id);
			
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
	
});

soatvApp.directive('soatvTv', function(/*soatv,*/ soatvVisualization) {
	return {
		restrict : 'A', // attribute only
		link : function(scope, elem, attr, ctrl) {
			elem[0].id = "soatv";
			soatvVisualization.init("tv", elem[0]);
		}
	};
});

soatvApp.directive('soatvHistory', function(/*soatv,*/ soatvVisualization) {
	return {
		restrict : 'A', // attribute only
		link : function(scope, elem, attr, ctrl) {
			elem[0].id = "soatvHistory";
			soatvVisualization.init("history", elem[0]);
			soatvVisualization.get("history").container.makeDraggable();
		}
	};
});
