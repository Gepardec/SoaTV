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
	/*return {
		generate : function(){
			return '#'+(Math.random()*0xFFFFFF<<0).toString(16);
		}
	};*/
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
	 * Performs initialization of visualizer and creates instance of cytoscape based
	 * on DOM-Element element, that will be used for rendering.
	 */
	visualizer.init = function(element) {
		
		visualizer.container = new VisElement("svg", "svg").create({
			containerId : element.id,
			properties : prop,
			globals : {}
		});
		//visualizer.container.add("phantom", "phantom", {});
	};
	return visualizer;
});

soatvVisualizationModule.factory('soatvConnection', function(soatvVisualizationProperties) {

	var connection = {
			connected : false,
			getMessage : function(){
				if(connection.connected == null){
					return " connecting";
				} else {
					return connection.connected ? " connected" : " disconnected";
				}
			},
			getImageLink : function(){
				if(connection.connected == null){
					return soatvVisualizationProperties.connection.imageConnecting;
				} else {
					return connection.connected ? 
							soatvVisualizationProperties.connection.imageConnected: 
							soatvVisualizationProperties.connection.imageDisconnected;
				}
			}
	};
	
	return connection;
});

