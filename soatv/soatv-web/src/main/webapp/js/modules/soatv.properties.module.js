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
			// returns the value of property or evaluates expression in ${}
			// any string property
			// any string property
			eval : function (property){
				var regex = /^\$\{(.*)\}$/g;
                var result = regex.exec(property);
				if(result != null){
					var body = result[1];	//take body of the expression
					body = "return " + injectValue(body,"\\$", "pref.");
					var f = new Function("pref", body);
					return f(this);
				} else {
					return property;
				}
			},
			svg : {
				width : 1000,
				height : 800,
				backgroundColor: "#F8F8F8"
			},
			node : {
				width : 200,
				height : 55,
				backgroundColor : "#F8F8F8",
				borderColor : "#AAAAAA",
				borderWidth : 1,
				topHeight : 30,
				padding : 4,
				"jboss" : {
					topColor : "#9C9C9C",
					topColorGrad : "#DEDEDE",
					image : {link : "images/jbossas7.png", width : 16, height : 16},
					textStyle : "fill: #333333; stroke: none;  font-size: 14px; font-family:'Monda'; text-shadow: 0 0 1px #363636;"
				},
			},
			
			component : {
				width : 180,
				height : 25,
				borderRadius : 5,
				backgroundColor : "#E0E0E0",
				borderColor : "#7D7D7D",
				borderWidth : "1px",
				margin : 10,	//top margin
				separatorPosition : 30,		// margin from top in px
				bean : {
					image : {link : "images/bean.png", width : 16, height : 16},
					textStyle : "fill: #1058a1; stroke: none;  font-size: 12px; font-family:'Monda';"
				},
				java : {
					image : {link : "images/java.png", width : 16, height : 16},
					textStyle : "fill: #1058a1; stroke: none;  font-size: 12px; font-family:'Monda';"
				}
			},
			
			message : {
				radius : 3,
				borderColor : "#404040",
				borderWidth : 3,
				paddingColor: "white",
				paddingWidth : 2
			},
			
			breadcrumb : {
				width : 100,
				height : 30,
				margin : 3,
				points : [
				          {x: 0, y: 0},
				          {x: "${$breadcrumb.width}", y: 0},
				          {x: "${$breadcrumb.width + 10}", y: "${$breadcrumb.height / 2}"},
				          {x: "${$breadcrumb.width}", y: "${$breadcrumb.height}"},
				          {x: 0, y: "${$breadcrumb.height}"},
				          {x: 10, y: "${$breadcrumb.height / 2}"}],
				text : {x : 20, y : "${$breadcrumb.height / 2}"},
				textStyle : "fill: white; stroke: none;  font-size: 12px; font-family:'Monda';",
				style : "fill : #9c9c9c; stroke : none;",
				
				vlineFillStyle : "fill:#CCCCCC;stroke:none;",	// vertical line
				message : {width : 14, height : 14, margin : 40, strokeWidth : 2, swidth : 20, sheight : 20}
			},
			
			history : {
				start : {x : 50, y : 50},
				pathWidth : 5
			},
			
			connection : {
				imageConnected : "images/icon_connected_green.png",
				imageDisconnected : "images/icon_disconnected_red.png",
				imageConnecting : "images/ajax-loader.gif"
			},
			transition : {
				duration : 1000,	// how long message flies to destination
				subduration : 500,	// correcting fly of the message if destination has changed its position
				traceDuration : 8000		// how long trace disappears
			}
			
		};
	return pref;
});