/**
 * Properties of soatv
 */
/**
 * Angular module serving as package for properties
 */
var soatvPropertiesModule = angular.module('soatvPropertiesModule', []);





/**
 * Factory creates singles instance of properties for visualization (css views of elements) that can be injected in other modules
 */
soatvPropertiesModule.factory('soatvVisualizationProperties', function() {
	var pref = {
			svg : {
				width : 1300,
				height : 800
			},
			node : {
				width : 200,
				height : 25,
				backgroundColor : "#7D7D7D",
				borderColor : "#7D7D7D",
				borderWidth : 1,
				topHeight : 25,
				"jboss" : {
					topColor : "#7D7D7D",
					image : {link : "images/jbossas7.png", width : 16, height : 16},
					textStyle : "fill: #E0E0E0; stroke: none;  font-size: 14px; font-family:'Monda';"
				},
				"esb" : {
					topColor : "#003666",
					image : {link : "images/esbsm.png", width : 16, height : 16},
					textStyle : "fill: #000000; stroke: none;  font-size: 14px; font-weight : bolder; font-family:monospace;",
					heigth : 90,
					ellipseRX : 10,
					ellipseRY : 22
				}
			},
			
			component : {
				width : 180,
				height : 25,
				borderRadius : 5,
				backgroundColor : "#E0E0E0",
				borderColor : "#7D7D7D",
				borderWidth : 1,
				margin : 10,	//top margin
				separatorPosition : 30,		// margin from top in px
				ws : {
					image : {link : "images/ws.png", width : 16, height : 16},
					textStyle : "fill: #404040; stroke: none;  font-size: 12px; font-family:'Monda';"
				}
			},
			
			message : {
				radius : 5,
				borderColor : "#404040",
				borderWidth : 3,
				paddingColor: "white",
				paddingWidth : 2
			},
			
			connection : {
				imageConnected : "images/icon_connected_green.png",
				imageDisconnected : "images/icon_disconnected_red.png",
				imageConnecting : "images/ajax-loader.gif"
			}
		};
	return pref;
});