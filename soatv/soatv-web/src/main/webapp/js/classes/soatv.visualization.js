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
	this.d3Container; 			// d3js element
	this.d3Draggable = null;	// d3js element that can be dragged. Drag of this visual component
								// must drag the whole element
	this.id2Child = {}; 		// maps id of child to child index
	this.children = []; 		// children instances of VisElement
	this.parent = null;
	this.visualComponents = []; // visual components that are not logical
	// children but part of compound element (e.g.
	// images, stripes, ellipses etc.)

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
	 * Removes self visualization and visualization of all children
	 */
	VisElement.prototype.removeVisualization = function() {
		this.d3Container.remove();
		this.visualComponents.forEach(function(vComponent) {
			vComponent.remove();
		});
		this.children.forEach(function(child) {
			child.removeVisualization();
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
	
	/**
	 * Makes visual element draggable
	 */
	VisElement.prototype.makeDraggable = function(){
		if(this.d3Draggable != null){
			this.d3Draggable.node(0).draggable = this;
			this.d3Draggable.call(VisElement._vis._drag);
		}
		return this;
	};
};

VisElement.builders = visBuilders; // list of builders



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
	} else if (elem.attr("points") != null){
		if(elem.translate == null){
			elem.translate = {x : shiftX, y : shiftY};
		} else {
			elem.translate.x += shiftX;
			elem.translate.y += shiftY;
		}
		elem.attr("transform", "translate("+elem.translate.x+", "+elem.translate.y+")");
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
 * Moves the given element to the given point
 * @param elem
 * @param x
 * @param y
 */
VisElement._moveTo = function(elem, x, y){
	var center = VisElement._getCenter(elem);
	var shiftX = x - center.x;
	var shiftY = y - center.y;
	VisElement._shift(elem, shiftX, shiftY);
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
 * Draws line on svg container with given parameters (color, width, opacity, zindex)
 * between p1 and p2
 */
VisElement._vis._line = function(svg, p1, p2, params) {
	var ln = params.zindex == null ? svg.append("line") : svg.insertz("line", params.zindex);
	var path = ln.attr("x1", p1.x).attr("y1", p1.y).attr("x2",
			p2.x).attr("y2", p2.y).attr("stroke", params.color).attr(
			"stroke-width", params.width)
			.attr("stroke-opacity", params.opacity);

	return path;

};

/**
 * Support of drag behaviour in d3js
 */
VisElement._vis._dragmove = function() {
	//VisElement._shift(d3.select(this), d3.event.dx, d3.event.dy);
	this.draggable.shiftTo(d3.event.dx, d3.event.dy);
	//console.log("event.x = "+ d3.event.x + ", event.y = " + d3.event.y);
	/*d3.select(this)
	      .attr("cx", d.x = Math.max(radius, Math.min(width - radius, d3.event.x)))
	      .attr("cy", d.y = Math.max(radius, Math.min(height - radius, d3.event.y)));
	}*/
};

VisElement._vis._drag = d3.behavior
.drag()
//.origin(function(d) { return d; })
.on("drag", VisElement._vis._dragmove);