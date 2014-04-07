/**
 * Class is responsible for maintaining information about visual element, its
 * type, and performing basic operations. New instance is created with element
 * type and id. For creation of visual representation builder is responsible.
 * 
 * @param type
 */
VisElement = function(type, id) {
	this.type = type;
	this.id = id;
	this.d3Container; // d3js element
	this.id2Child = {}; // maps id of child to child index
	this.children = []; // children instances of VisElement
	this.parent = null;
	this.visualComponents = []; // visual components that are not logical
	// children but part of compound element (e.g.
	// images, stripes, ellipses etc.)

	this.transition = null; // stores the transition instance for safety
	// transition binding

	/**
	 * Common global elements for all children of the same svg
	 */
	this.globals = null;

	/**
	 * Creates visual representation of the object
	 */
	VisElement.prototype.create = function(argsObject) {
		VisElement.builders[this.type].build(this, argsObject);
		return this;
	};

	/**
	 * Returns child with the given id
	 */
	VisElement.prototype.find = function(id) {
		var index = this.id2Child[id];
		if (index != null) {
			return this.children[index];
		} else {
			return null;
		}
	};

	/**
	 * Creates new VisElement and adds it to children
	 */
	VisElement.prototype.add = function(type, id, argsObject) {
		if (this.find(id) != null) {
			console.log("element with the given id " + id
					+ " is already a child of " + this.id);
		} else {
			this.children.push(new VisElement(type, id));
			this.id2Child[id] = this.children.length - 1;

			this.children[this.children.length - 1].globals = this.globals;
			this.children[this.children.length - 1].parent = this;

			this.children[this.children.length - 1].create(argsObject);
			return this;
		}
	};

	/**
	 * Adds existing visual element to the children
	 */
	VisElement.prototype.addVisElement = function(visElement) {
		if (this.find(visElement.id) != null) {
			console.log("element with the given id " + id
					+ " is already a child of " + this.id);
		} else {
			this.children.push(visElement);
			this.id2Child[visElement.id] = this.children.length - 1;

			this.children[this.children.length - 1].globals = this.globals;
			this.children[this.children.length - 1].parent = this;

			return this;
		}
	};

	/**
	 * Sets position of center of corresponding element
	 */
	VisElement.prototype.setCenterPosition = function(x, y) {
		var center = VisElement._getCenter(this.d3Container);
		var shiftX = x - center.x;
		var shiftY = y - center.y;

		this.shiftTo(shiftX, shiftY);
	};

	/**
	 * Shifts element according given values
	 */
	VisElement.prototype.shiftTo = function(shiftX, shiftY) {
		// move each visual component
		this.visualComponents.forEach(function(vComponent) {
			VisElement._shift(vComponent, shiftX, shiftY);
		});

		// move each child
		this.children.forEach(function(child) {
			child.shiftTo(shiftX, shiftY);
		});

		// move self
		VisElement._shift(this.d3Container, shiftX, shiftY);
	};

	/**
	 * Gets radius of the element (or a half of the diagonal)
	 */
	VisElement.prototype.getRadius = function() {

		if (this.d3Container.attr("width") != null) {
			var w = parseInt(this.d3Container.attr("width"));
			var h = parseInt(this.d3Container.attr("height"));
			return Math.round(Math.sqrt(w * w + h * h) / 2);
		}

		if (this.d3Container.attr("r") != null) {
			return parseInt(this.d3Container.attr("r"));
		}

		return 0;
	};

	/**
	 * Returns current transition instance or creates new one. Function takes
	 * callback function as parameter that will be called at the transition end
	 */
	VisElement.prototype.getTransition = function(onEnd, global) {
		var self = this;
		var d3Elem = this.d3Container;
		if (global === true) {
			d3Elem = d3;
		}
		if (d3Elem == null) {
			return null;
		} else {
			if (this.transition == null || this.transition.finished) {
				var t = d3Elem.transition().each("end", function() {
					onEnd();
					t.finished = true;
				});
				t.finished = false;
				self.transition = t;
			} else {
				var t = d3Elem.transition().each("end", function() {
					onEnd();
					t.finished = true;
				});
				t.finished = false;
				self.transition = t;
			}
		}
		return self.transition;
	};

	/**
	 * Removes child with specific id
	 */
	VisElement.prototype.removeChild = function(id) {
		var elem = this.find(id);
		if (elem != null) {
			var index = this.children[id];
			elem.removeVisualization();
			this.children.splice(index, 1);
			delete this.children[id];
			this.reindex();
		}
	};

	/**
	 * Removes itself
	 */
	VisElement.prototype.removeVisualization = function() {
		this.d3Container.remove();
		this.visualComponents.forEach(function(vComponent) {
			vComponent.remove();
		});
	};

	/**
	 * Update index id2Child
	 */
	VisElement.prototype.reindex = function() {
		for (var int = 0; int < this.children.length; int++) {
			this.id2Child[this.children[int].id] = int;
		}
	};
};

VisElement.builders = {}; // list of builders

/**
 * Builder for the main container
 */
VisElement.builders["svg"] = {
	build : function(visElement, argsObject) {
		visElement.d3Container = d3.select("#" + argsObject.containerId)
				.append("svg").attr("width", "100%")
				.attr("height", argsObject.properties.svg.height).attr("id",
						visElement.id);

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
VisElement.builders["node"] = {
	build : function(visElement, argsObject) {
		var nodeType = argsObject.type;
		var nodeHeader = argsObject.header;
		var svg = visElement.globals.svg;
		var prop = visElement.globals.properties;

		var x = prop.svg.width / 2;
		var y = prop.svg.height / 2;

		var margin = 4;
		
		// build gradients
		var grad = svg.select("defs").append("linearGradient").attr("id",
				nodeType + "Gradient").attr("x1", "0%").attr("y1", "0%").attr("x2", "0%").attr("y2", "100%");

		grad.append("stop").attr("offset", "0").attr("stop-color",
				prop.node[nodeType].topColorGrad);
		
		grad.append("stop").attr("offset", "1").attr("stop-color",
				prop.node[nodeType].topColor);

		visElement.d3Container = svg.append("rect").attr("x", x).attr("y", y)
				.attr("width", prop.node.width)
				.attr("height", prop.node.height).attr(
						"style",
						"fill:" + prop.node.backgroundColor + ";stroke:"
								+ prop.node.borderColor + ";stroke-width:"
								+ prop.node.borderWidth + ";");

		var stripeRect = svg.append("rect").attr("x", x + margin).attr("y",
				y + margin).attr("width", prop.node.width - 2 * margin).attr(
				"height", prop.node.topHeight).attr(
				"style",
				"fill:url(#"+nodeType+"Gradient);" + ";stroke: none;");

		var img = svg.append("image").attr("x", x + margin + 5).attr("y",
				y + margin + 5).attr("width", prop.node[nodeType].image.width)
				.attr("height", prop.node[nodeType].image.height).attr(
						"xlink:href", prop.node[nodeType].image.link);

		var text = svg.append("text").attr("x", x + margin + 25).attr("y",
				y + margin + 20).attr("style", prop.node[nodeType].textStyle)
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
VisElement.builders["component"] = {
	build : function(visElement, argsObject) {
		var nodeHeader = argsObject.header;
		var svg = visElement.globals.svg;
		var parentNode = visElement.parent;
		var prop = visElement.globals.properties;
		
		var componentType = prop.component[argsObject.type] != null ? argsObject.type : "java";

		var mainRect = parentNode.d3Container;
		// var mainHeight = parseInt(mainRect.attr("height"));

		/*
		 * mainRect.transition().attr("height", mainHeight +
		 * prop.component.height + 7).duration(500).each("end",
		 */
		// var onEnd = function(){
		// compute number of added children
		var nrComponents = parentNode.children.indexOf(visElement) + 1;

		mainRect.attr("height", (1 + nrComponents) * prop.component.margin
				+ nrComponents * prop.component.height + prop.node.topHeight);

		var x = parseInt(parentNode.d3Container.attr("x"))
				+ prop.component.margin;
		var y = prop.node.topHeight + parseInt(parentNode.d3Container.attr("y")) + (nrComponents)
				* prop.component.margin + (nrComponents - 1)
				* prop.component.height;
		
		/*visElement.d3Container = svg.append("rect").attr("x", x).attr("y", y)
		.attr("width",
				prop.component.width).attr("height", prop.component.height)
				.attr(
						"style",
						"fill:" + prop.component.backgroundColor + ";stroke:"
								+ prop.component.borderColor + ";stroke-width:"
								+ prop.component.borderWidth + ";");*/
		
		visElement.d3Container = svg.append("rect").attr("x", x).attr("y", y)
		.attr("width",
				prop.component.width).attr("height", prop.component.height)
				.attr(
						"style",
						"fill: none; stroke : none;");

		var img = svg.append("image").attr("x", x + 5).attr("y", y + 4).attr(
				"width", prop.component[componentType].image.width).attr(
				"height", prop.component[componentType].image.height).attr(
				"xlink:href", prop.component[componentType].image.link);

		var text = svg.append("text").attr("x", x + 25).attr("y", y + 16).attr(
				"style", prop.component[componentType].textStyle).text(
				nodeHeader);
		
		if(nrComponents > 1){
			var stripe = svg.append("line").attr("x1", x).attr("y1", y - prop.component.margin / 2)
			.attr("x2", x + prop.component.width).attr("y2", y - prop.component.margin / 2)
			.attr("style", "stroke : " + prop.component.borderColor + "; stroke-width: " +prop.component.borderWidth + "; stroke-dasharray: 10, 2;" );
			visElement.visualComponents.push(stripe);
		}
		visElement.visualComponents.push(img);
		visElement.visualComponents.push(text);

		visElement.globals.force.start();
		/*
		 * };
		 * 
		 * tween = function(d, i, a){ return d3.interpolate(a,
		 * parseInt(mainRect.attr("height")) + prop.component.height + 7); };
		 * 
		 * parentNode.getTransition(onEnd).attrTween("height",
		 * tween).duration(500);
		 */
	}
};

/**
 * Builder for the message element
 */
VisElement.builders["message"] = {
	build : function(visElement, argsObject) {
		var color = argsObject.color;
		var parentElement = visElement.parent;
		var svg = visElement.globals.svg;
		var id = visElement.id;
		var messageClass = "message" + id;
		var classed = {};
		classed[messageClass] = true;
		var prop = visElement.globals.properties;

		// var gradId = "grad" + id;

		// register gradient
		/*
		 * var grad = svg.select("defs").append("radialGradient").attr("id",
		 * gradId).attr("cx", "50%").attr("cy", "50%").attr("r", "50%")
		 * .attr("fx", "50%").attr("fy", "50%");
		 * 
		 * grad.append("stop").attr("offset", "10%").attr("style", "stop-color:" +
		 * color + ";stop-opacity : 1");
		 * 
		 * grad.append("stop") // TODO REMOVE THIS SHIT AFTER FINISHING
		 * .attr("offset", "100%").attr("style", "stop-color:white;stop-opacity :
		 * 0");
		 */
		var c = VisElement._getCenter(parentElement.d3Container);

		visElement.d3Container = svg.append("circle").attr("cx", c.x).attr(
				"cy", c.y).attr("r", prop.message.radius).attr("fill",
				prop.svg.backgroundColor).attr("stroke", color).attr(
				"stroke-width", "2px").classed(classed);

		// adding padding
		/*
		 * visElement.visualComponents.push( svg.append("circle").attr("cx",
		 * c.x).attr( "cy", c.y).attr("r", prop.message.radius-2).attr("fill",
		 * "none") .attr("stroke", prop.message.paddingColor)
		 * .attr("stroke-width", prop.message.paddingWidth) .classed(classed) );
		 */

		visElement.color = color;

		visElement.moveTo = function(destination, endCallBack) {

			var onEnd = function() {

				if (VisElement._getDistance(destination.d3Container,
						visElement.d3Container) > 5) {
					to = VisElement._getCenter(destination.d3Container);
					visElement.d3Container.transition().duration(2000).attr(
							"cx", to.x).attr("cy", to.y).each("end", onEnd);
				} else {
					var index = visElement.parent.id2Child[visElement.id];
					visElement.parent.children.splice(index, 1);
					delete visElement.parent.id2Child[visElement.id];
					// destination.addVisElement(visElement);
					clearInterval(interval);
					clearInterval(destInterval);
					visElement.removeVisualization();
					visElement.parent.removeChild(visElement.id);
					if(endCallBack != null && typeof(endCallBack) === 'function'){
						endCallBack();
					}
				}

			};

			to = VisElement._getCenter(destination.d3Container);
			from = VisElement._getCenter(visElement.d3Container);

			// remember previous position
			var prev = {
				x : parseInt(visElement.d3Container.attr("cx")),
				y : parseInt(visElement.d3Container.attr("cy"))
			};

			// remember previous destination
			var prevDest = to;

			var interval = setInterval(function() {
				var curr = {
					x : parseInt(visElement.d3Container.attr("cx")),
					y : parseInt(visElement.d3Container.attr("cy"))
				};

				var path = VisElement._vis._line(visElement.globals.svg, prev,
						curr, {
							color : visElement.color,
							width : 1,
							opacity : 0.5

						});

				path.transition().remove(path).duration(8000).attr(
						"stroke-opacity", 0);
				prev = curr;
			}, 5);

			// control whether destination has changed its position
			var destInterval = setInterval(function() {
				var currDest = VisElement._getCenter(destination.d3Container);
				if (VisElement._getDistance(currDest, prevDest, true) > 5) {

					visElement.d3Container.transition().duration(2000).attr(
							"cx", currDest.x).attr("cy", currDest.y).each(
							"end", onEnd);
				}
				prevDest = currDest;
			}, 500);

			// visElement.getTransition(onEnd,
			// true).duration(2000).selectAll(".message"+id).attr("cx",
			// to.x).attr("cy", to.y);
			visElement.d3Container.transition().duration(2000)
					./* selectAll(".message"+id). */attr("cx", to.x).attr("cy",
							to.y).each("end", onEnd);
		};

	}
};

/*
 * VisElement.builders["phantom"] = { build : function(visElement, argsObject){
 * 
 * var prop = visElement.globals.properties;
 * 
 * visElement.fixed = true; //make it fixed for force visElement.x =
 * prop.svg.width/2; visElement.y = prop.svg.height/2; visElement.isPhantom =
 * true; visElement.getRadius = function(){ var w = prop.node.width; var h =
 * prop.node.esb.height;
 * 
 * return Math.sqrt(w * w + h * h) / 2; };
 * 
 * visElement.shiftTo = function(x, y){}; visElement.setCenterPosition =
 * function(x, y){}; } };
 */

/**
 * Shifts svg element
 * 
 * @param elem
 *            svg element to be shifted
 * @param shiftX
 * @param shiftY
 */
VisElement._shift = function(elem, shiftX, shiftY) {
	if (elem == null) {
		return;
	}
	if (elem.attr("x") != null) { // rectangle, text
		var newX = parseInt(elem.attr("x")) + shiftX;
		var newY = parseInt(elem.attr("y")) + shiftY;
		elem.attr("x", newX).attr("y", newY);
	} else if (elem.attr("cx") != null) { // circle, ellipse
		var newX = parseInt(elem.attr("cx")) + shiftX;
		var newY = parseInt(elem.attr("cy")) + shiftY;
		elem.attr("cx", newX).attr("cy", newY);
	} else { // line
		var newX1 = parseInt(elem.attr("x1")) + shiftX;
		var newY1 = parseInt(elem.attr("y1")) + shiftY;
		var newX2 = parseInt(elem.attr("x2")) + shiftX;
		var newY2 = parseInt(elem.attr("y2")) + shiftY;
		elem.attr("x1", newX1).attr("y1", newY1).attr("x2", newX2).attr("y2",
				newY2);
	}
};

/**
 * Returns center point of the svg element
 * 
 * @param elem
 * @returns {}
 */
VisElement._getCenter = function(elem) {
	if (elem.attr("x") != null) { // rectangle
		var x = parseInt(elem.attr("x"));
		var y = parseInt(elem.attr("y"));
		var cx = Math.round(x + parseInt(elem.attr("width")) / 2);
		var cy = Math.round(y + parseInt(elem.attr("height")) / 2);
		return {
			x : cx,
			y : cy
		};
	} else { // circle
		return {
			x : parseInt(elem.attr("cx")),
			y : parseInt(elem.attr("cy"))
		};
	}
};

/**
 * Returns distance between centers of two svg elements or two points (in this
 * case points=true)
 * 
 * @param elem
 * @returns {}
 */
VisElement._getDistance = function(elem1, elem2, points) {
	var p1 = elem1;
	var p2 = elem2;
	if (points !== true) {
		p1 = VisElement._getCenter(elem1);
		p2 = VisElement._getCenter(elem2);
	}

	var x = p1.x - p2.x;
	var y = p1.y - p2.y;

	return Math.round(Math.sqrt(x * x + y * y));
};

/**
 * Service functions for visualization
 */
VisElement._vis = {};

/**
 * Draws path on svg container with given parameters (interpolate, color, width,
 * opacity) between p1 and p2
 */
VisElement._vis._path = function(svg, p1, p2, params) {
	var lineFunction = d3.svg.line().x(function(d) {
		return d.x;
	}).y(function(d) {
		return d.y;
	}).interpolate(params.interpolate);

	var path = svg.append("path").attr("d", lineFunction([ p1, p2 ])).attr(
			"stroke", params.color).attr("stroke-width", params.width).attr(
			"fill", "none").attr("stroke-opacity", params.opacity);

	return path;
};

/**
 * Draws line on svg container with given parameters (color, width, opacity)
 * between p1 and p2
 */
VisElement._vis._line = function(svg, p1, p2, params) {
	var path = svg.append("line").attr("x1", p1.x).attr("y1", p1.y).attr("x2",
			p2.x).attr("y2", p2.y).attr("stroke", params.color).attr(
			"stroke-width", params.width)
			.attr("stroke-opacity", params.opacity);

	return path;

};