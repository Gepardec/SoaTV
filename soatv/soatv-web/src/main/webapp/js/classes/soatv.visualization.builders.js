/**
*	Builders for visual elements
*/
visBuilders = {};
/**
 * Builder for the main container
 */
visBuilders["svg"] = {
	build : function(visElement, argsObject) {
		visElement.d3Container = d3.select("#" + argsObject.containerId)
				.append("svg")
				.attr("width", "100%")
				.attr("height", argsObject.properties.svg.height)
				.attr("id", visElement.id);
		
		// create elements for support z-index
		for(var i = 0; i < 10; i++){
			visElement.d3Container.append("g")
			.attr("id","zindex"+i);
		}
		
		// extend svg to support insertz (insert with z-index)
		visElement.d3Container.insertz = function(element, zindex){
			var zindexId = "zindex"+zindex;
			return visElement.d3Container.insert(element,"#"+zindexId);
		};

		visElement.d3Container.append("defs");

		// build force
		var nodes = visElement.children;
		var links = [];
		for (var i = 0; i < nodes.length; i++) {
			for (var j = i + 1; j < nodes.length; j++)
				links.push({
					source : nodes[i],
					target : nodes[j]
				});
		}
		var force = d3.layout.force().nodes(nodes).links(links).gravity(0.05)
				.linkDistance(
						function(link, index) {

							// get nodes radius
							var r1 = link.source.getRadius();
							var r2 = link.target.getRadius();

							// calculate minimal distance
							var md = r1 + r2;
							if (link.source.isCenral != null
									|| link.target.isCentral != null) {
								return md + 100;
							} else {
								return md + 100;
							}
						}).size(
						[ argsObject.properties.svg.width,
								argsObject.properties.svg.height ]);

		force.on("tick", function() {
			visElement.children.forEach(function(child) {
				child.setCenterPosition(child.x, child.y);
			});

		});
		force.visLinks = links;

		if (argsObject.globals == null) {
			visElement.globals = {};
		} else {
			visElement.globals = argsObject.globals;
		}
		visElement.globals.svg = visElement.d3Container;
		visElement.globals.properties = argsObject.properties;
		visElement.globals.force = force;
	}
};

/**
 * Builder for the node element
 */
visBuilders["node"] = {
	build : function(visElement, argsObject) {
		var nodeType = argsObject.type;
		var nodeHeader = argsObject.header;
		var svg = visElement.globals.svg;
		var prop = visElement.globals.properties;

		var x = prop.svg.width / 2;
		var y = prop.svg.height / 2;

		//padding of content inside node
		var padding = prop.node.padding;

		// build gradients
		var grad = svg.select("defs").append("linearGradient")
		.attr("id", nodeType + "Gradient")
		.attr("x1", "0%")
		.attr("y1", "0%")
		.attr("x2", "0%")
		.attr("y2", "100%");

		grad.append("stop")
		.attr("offset", "0")
		.attr("stop-color", prop.node[nodeType].topColorGrad);

		grad.append("stop")
		.attr("offset", "1")
		.attr("stop-color", prop.node[nodeType].topColor);

		visElement.d3Container = svg.append("rect").attr("x", x).attr("y", y)
				.attr("width", prop.node.width)
				.attr("height", prop.node.height).attr(
						"style",
						"fill:" + prop.node.backgroundColor + ";stroke:"
								+ prop.node.borderColor + ";stroke-width:"
								+ prop.node.borderWidth + ";");

		var stripeRect = svg.append("rect")
		.attr("x", x + padding)
		.attr("y", y + padding)
		.attr("width", prop.node.width - 2 * padding)
		.attr("height", prop.node.topHeight)
		.attr("style", "fill:url(#" + nodeType + "Gradient);" + ";stroke: none;");

		var img = svg.append("image")
		.attr("x", x + padding + 5)
		.attr("y", y + padding + 5)
		.attr("width", prop.node[nodeType].image.width)
		.attr("height", prop.node[nodeType].image.height)
		.attr("xlink:href", prop.node[nodeType].image.link);

		var text = svg.append("text")
		.attr("x", x + padding + 25)
		.attr("y", y + padding + 20)
		.attr("style", prop.node[nodeType].textStyle)
		.text(nodeHeader);

		visElement.visualComponents.push(stripeRect);
		visElement.visualComponents.push(img);
		visElement.visualComponents.push(text);
		visElement.nextChildYPosition = y + prop.component.margin;

		for (var i = 0; i < visElement.parent.children.length - 1; i++) {
			visElement.globals.force.visLinks.push({
				source : visElement.parent.children[i],
				target : visElement
			});
		}
		visElement.globals.force.links(visElement.globals.force.visLinks)
				.start();
	}
};

/**
 * Builder for the component element
 */
visBuilders["component"] = {
	build : function(visElement, argsObject) {
		var nodeHeader = argsObject.header;
		var svg = visElement.globals.svg;
		var parentNode = visElement.parent;
		var prop = visElement.globals.properties;

		var componentType = prop.component[argsObject.type] != null ? argsObject.type
				: "java";

		var mainRect = parentNode.d3Container;

		// compute number of added children
		var nrComponents = parentNode.children.indexOf(visElement) + 1;

		mainRect.attr("height", (1 + nrComponents) * prop.component.margin
				+ nrComponents * prop.component.height + prop.node.topHeight);

		var x = parseInt(parentNode.d3Container.attr("x"))
				+ prop.component.margin;
		var y = prop.node.topHeight
				+ parseInt(parentNode.d3Container.attr("y")) + (nrComponents)
				* prop.component.margin + (nrComponents - 1)
				* prop.component.height;

		visElement.d3Container = svg.append("rect")
		.attr("x", x)
		.attr("y", y)
		.attr("width", prop.component.width)
		.attr("height", prop.component.height)
		.attr("style", "fill: none; stroke : none;");

		var img = svg.append("image")
		.attr("x", x + 5)
		.attr("y", y + 4)
		.attr("width", prop.component[componentType].image.width)
		.attr("height", prop.component[componentType].image.height)
		.attr("xlink:href", prop.component[componentType].image.link);

		var text = svg.append("text")
		.attr("x", x + 25)
		.attr("y", y + 16)
		.attr("style", prop.component[componentType].textStyle)
		.text(nodeHeader);

		if (nrComponents > 1) {
			var stripe = svg.append("line").attr("x1", x).attr("y1",
					y - prop.component.margin / 2).attr("x2",
					x + prop.component.width).attr("y2",
					y - prop.component.margin / 2).attr(
					"style",
					"stroke : " + prop.component.borderColor
							+ "; stroke-width: " + prop.component.borderWidth
							+ "; stroke-dasharray: 10, 2;");
			visElement.visualComponents.push(stripe);
		}
		visElement.visualComponents.push(img);
		visElement.visualComponents.push(text);

		visElement.globals.force.start();
	}
};

/**
 * Builder for the message element
 */
visBuilders["message"] = {
	build : function(visElement, argsObject) {
		var color = argsObject.color;
		var parentElement = visElement.parent;
		var svg = visElement.globals.svg;
		var id = visElement.id;
		var messageClass = "message" + id;
		var classed = {};
		classed[messageClass] = true;
		var prop = visElement.globals.properties;

		var c = VisElement._getCenter(parentElement.d3Container);

		visElement.d3Container = svg.append("circle")
		.attr("cx", c.x)
		.attr("cy", c.y)
		.attr("r", prop.message.radius)
		.attr("fill", prop.svg.backgroundColor)
		.attr("stroke", color)
		.attr("stroke-width", "2px")
		.classed(classed);	// add class="message$ID"

		visElement.color = color;

		//transition to new destination
		visElement.moveTo = function(destination, endCallBack) {

			// function called on transition end
			var onEnd = function() {

				// destination may have been moved from its original position. if yes, perform another transition
				if (VisElement._getDistance(destination.d3Container,visElement.d3Container) > 20)
				{
					to = VisElement._getCenter(destination.d3Container);
					visElement.d3Container.transition()
					.duration(prop.transition.subduration)
					.attr("cx", to.x)
					.attr("cy", to.y)
					.each("end", onEnd);
				} else {	//remove this message
					var index = visElement.parent.id2Child[visElement.id];
					visElement.parent.children.splice(index, 1);
					delete visElement.parent.id2Child[visElement.id];
					
					clearInterval(interval);

					visElement.removeVisualization();
					visElement.parent.removeChild(visElement.id);
					
					//execute external callback
					if (endCallBack != null && typeof (endCallBack) === 'function') {
						endCallBack();
					}
				}

			};

			
			var from = VisElement._getCenter(parentElement.d3Container);


			

			var interval = null;

			// control whether position of the message source (original component) is stable
			var stableInterval = setInterval(function() {
				
				var currPos = VisElement._getCenter(parentElement.d3Container);
				if (VisElement._getDistance(currPos, from, true) < 5) {
					clearInterval(stableInterval);
					
					// remember previous position
					var prev = {
						x : parseInt(visElement.d3Container.attr("cx")),
						y : parseInt(visElement.d3Container.attr("cy"))
					};
					
					// interval to draw trace
					interval = setInterval(function() {
						var curr = {
							x : parseInt(visElement.d3Container.attr("cx")),
							y : parseInt(visElement.d3Container.attr("cy"))
						};

						var path = VisElement._vis._line(visElement.globals.svg, prev,
								curr, {
									color : visElement.color,
									width : 1,
									opacity : 1

								});

						path.transition()
						.remove(path)
						.duration(prop.transition.traceDuration)
						.attr("stroke-opacity", 0);
						prev = curr;
					}, 5);
					
					to = VisElement._getCenter(destination.d3Container);
					
					visElement.d3Container.transition().duration(prop.transition.duration)
					.attr("cx", to.x)
					.attr("cy", to.y)
					.each("end", onEnd);
				}
				from = currPos;
			}, 500);	

		};

	}
};

//------------------- History elements --------------------//

visBuilders["history"] = {
		/**
		 * Expected argsObject with the following structure :
		 * {components : [components], messagesAlias : "messagesProperty", sourceMessage}
		 * component {id : "id", parent : parent, "messagesProperty" : [messages]}
		 * message {id : , color : }
		 * sourceMessage : message for this history
		 * @param visElement
		 * @param argsObject
		 */
		build : function(visElement, argsObject) {
				
		var svg = visElement.globals.svg;
		var prop = visElement.globals.properties;
		var start = prop.history.start;
		
		visElement.d3Container = svg.append("g").attr("id", visElement.id);
		
		var width = prop.breadcrumb.width;
		var margin = prop.breadcrumb.margin;
		var i = 0;
		
		// line points for the visualization of message pass path
		var pathPoints = [];
		
		argsObject.components.forEach(function(component){
			var x = start.x + i * (width + margin);
			visElement.add(
					"breadcrumb",
					"breadcrumb" + i,
					{
						x : x,
						y : start.y,
						text : component.id,
						messages : component[argsObject.messagesAlias],
						sourceMessageId : argsObject.sourceMessage.id,
						pathPoints : pathPoints
					}
			);
			i++;
		});
		
		//visualize message pass path
		
		if(pathPoints.length > 1){
			for(var i = 1; i < pathPoints.length; i++){
				var p1 = pathPoints[i-1];
				var p2 = pathPoints[i];
				var line = VisElement._vis._line(svg, p1, p2, {
					color : argsObject.sourceMessage.color,
					opacity : 1,
					width : prop.history.pathWidth,
					zindex : 1
					});
				visElement.visualComponents.push(line);
			}
		}
	}
};

visBuilders["breadcrumb"] = {
		
		// initial coordinates of breadcrumb
		coordinates : {points : [], text : null},
		
		// calculate all coordinates of breadcrumb based on properties
		buildCoordinates : function(prop){
			var self = visBuilders["breadcrumb"];
			prop.breadcrumb.points.forEach(function(point){
				self.coordinates.points.push ({x : prop.eval(point.x), y : prop.eval(point.y)});
			});
			
			self.coordinates.text = {x : prop.eval(prop.breadcrumb.text.x), y : prop.eval(prop.breadcrumb.text.x)};
		},
		
		/**
		 * Expected argsObject with the following structure:
		 * {x : startx, y : starty, text: text, messages[messages], pathPoints : [points], sourceMessageId :}
		 * message {id : , color : }
		 * points : points of the line for the visualization of message pass path
		 * sourceMessageId : id of the message for which the current visualizaton is being built
		 * @param visElement
		 * @param argsObject
		 */
		build : function(visElement, argsObject) {
			
			var svg = visElement.globals.svg;
			var prop = visElement.globals.properties;
			var start = {x : argsObject.x, y : argsObject.y};
			var text = argsObject.text;
			var sourceMessageId = argsObject.sourceMessageId;
			
			var coordinates = visBuilders["breadcrumb"].coordinates;
			// check if coordinates are initialized
			if(coordinates.points.length === 0){
				visBuilders["breadcrumb"].buildCoordinates(prop);
			}
			
			// build points argument for poligon
			var points = "";
			coordinates.points.forEach(function(point){
				points += " " + (start.x + point.x) + "," + (start.y + point.y);
			});
			
			visElement.d3Container = svg.append("polygon")
			.attr("points", points)
			.attr("style", prop.breadcrumb.style)
			.append("title").text(text);
			
			// adjust text length
			if(text.length > 10){
				text = text.substring(0, 6) + "...";
			}
			
			var textElement = svg.append("text")
			.attr("x", start.x + coordinates.text.x)
			.attr("y", start.y + coordinates.text.y)
			.attr("style", prop.breadcrumb.textStyle)
			.text(text);
			
			var vericalLine = svg.insertz("rect", 0)
			.attr("x", start.x + prop.breadcrumb.width / 2 - 5)
			.attr("y", start.y + prop.breadcrumb.height)
			.attr("width", 10)
			.attr("height", 2000)
			.attr("style", prop.breadcrumb.vlineFillStyle);
			
			var messages = argsObject.messages;
			var i = 0;
			
			messages.forEach(function(message){
				
				var mwidth = prop.breadcrumb.message.width;
				var mheight = prop.breadcrumb.message.height;
				
				// check whether current message is the visualized message
				if(message.id === sourceMessageId){ //then add the message center to the path
					mwidth = prop.breadcrumb.message.swidth;
					mheight = prop.breadcrumb.message.sheight;
				}
				
				
				var msg = svg.insertz("rect", 2)
				.attr("x", start.x + prop.breadcrumb.width / 2 - mwidth / 2)
				.attr("y", start.y + prop.breadcrumb.height + (i+1)*prop.breadcrumb.message.margin + i * prop.breadcrumb.message.height)
				.attr("width", mwidth)
				.attr("height", mheight)
				.attr("style", "fill:" + message.color + ";stroke-width : "+ prop.breadcrumb.message.strokeWidth +"; stroke: " + prop.svg.backgroundColor + ";");
				
				visElement.visualComponents.push(msg);
				
				// check whether current message is the visualized message
				if(message.id === sourceMessageId){ //then add the message center to the path
					argsObject.pathPoints.push(VisElement._getCenter(msg));
				}
				
				i++;
			});
						
			visElement.visualComponents.push(textElement);
			visElement.visualComponents.push(vericalLine);
			
		}
};
