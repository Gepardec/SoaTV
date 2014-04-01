/**
 * Angular module serving as package for model
 */
var soatvModelModule = angular.module('soatvModelModule', []);

/**
 * Factory creates singles instance of controller, that can be injected in other modules
 */
soatvModelModule.factory('soatvModel', function() {
	
	var instance = new Controller();
	instance.setTopic(new MessageTopic());
	return instance;
	
});