function copyProps(from, to) {
    for (var key in from) {
        to[key] = from[key];
    }
}

/**
 * Replaces in string all occurances of variable by the given value. Variable in string must start with $
 * E.g. valueInjector("Hello, $text!", "text", "world") will return the string "Hello, world!"
 * @param string
 * @param variable
 * @param value
 */
function injectValue(string, variable, value){
	return string.replace(new RegExp("\\$("+variable+")", "g"), value);
}
/**
 * =======================================================================
 * Visualizer
 * =======================================================================
 */

/**
 * Angular module serving as package for visualizer
 */
var soatvVisualizationModule = angular.module('soatvVisualizationModule', ['soatvPropertiesModule']);

//auxiliary service to generate random color
soatvVisualizationModule.factory('serviceRandomColor', function(){
	return{
		generate : function(){
		    var letters = '0123456789ABCDEF'.split('');
		    var color = '#';
		    for (var i = 0; i < 6; i++ ) {
		        color += letters[Math.round(Math.random() * 15)];
		    }
		    return color;
		}
	};
});

soatvVisualizationModule.factory('soatvVisualization', function(soatvVisualizationProperties) {

	var visualizer = {};
	var prop = soatvVisualizationProperties;
	/**
	 * Performs initialization of visualizer and creates instance of svg based
	 * on DOM-Element element, that will be used for rendering.
	 */
	visualizer.init = function(id, element) {
		if(visualizer[id] == null)
		visualizer[id] = 
		{
				container : new VisElement("svg", "svg"+id).create({
					containerId : element.id,
					properties : prop,
					globals : {}
				})
		};
	};
	
	visualizer.get = function(id){
		return visualizer[id];
	};
	
	return visualizer;
});

/**
 * Provides connecting visualization with connecting spinner
 */
soatvVisualizationModule.factory('soatvConnection', function(soatvVisualizationProperties) {

	var connection = {
			connected : false,
			/**
			 * Retuns message that must be currently displayed.
			 */
			getMessage : function(){
				if(this.connected == null){
					return " connecting";
				} else {
					return this.connected ? " connected" : " disconnected";
				}
			},
			/**
			 * Returns link to the image that must be currently displayed
			 */
			getImageLink : function(){
				if(this.connected == null){
					return soatvVisualizationProperties.connection.imageConnecting;
				} else {
					return this.connected ? 
							soatvVisualizationProperties.connection.imageConnected: 
							soatvVisualizationProperties.connection.imageDisconnected;
				}
			}
	};
	
	return connection;
});

