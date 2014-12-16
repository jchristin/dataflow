"use strict";

var assert = require("assert"),
	stream = require("stream"),
	port = require("./port");

exports.debug = false;

/*
 * Class Brick
 */
function Brick() {
	this.inputs = {};
	this.outputs = {};
	this.props = {};
}

/*
 * Class Composite
 */
function Composite() {
	Brick.call(this);
	this.bricks = [];
}

Composite.prototype = Object.create(Brick.prototype);
Composite.prototype.constructor = Composite;

/*
 * Dataflow API
 */
exports.define = function(definition) {
	function NewBrick(props, name) {
		Brick.call(this);

		var self = this;
		NewBrick.prototype.inputs.forEach(function(element) {
			self.inputs[element] = new port.InputPort();
			self.inputs[element].on("data", function() {
				setImmediate(function() {
					if (exports.debug) {
						console.log(name + " '" + element + "' receives data: " + this.getData());
					}

					definition.process.call(self);
				}.bind(this));
			});
		});

		NewBrick.prototype.outputs.forEach(function(element) {
			self.outputs[element] = new port.OutputPort();
		});

		// Default props.
		Object.keys(NewBrick.prototype.props).forEach(function(key) {
			self.props[key] = NewBrick.prototype.props[key];
		});

		// User define props.
		if (props) {
			Object.keys(props).forEach(function(key) {
				self.props[key] = props[key];
			});
		}
	}

	NewBrick.prototype = Object.create(Brick.prototype);
	NewBrick.prototype.constructor = NewBrick;
	NewBrick.prototype.inputs = definition.inputs || [];
	NewBrick.prototype.outputs = definition.outputs || [];
	NewBrick.prototype.props = definition.props || {};

	return NewBrick;
};

exports.create = function(program, props) {
	var composite = new Composite();

	// Bricks.
	program.bricks.forEach(function(element) {
		var brick;

		if (typeof element.type === "string") {
			brick = new(require(element.type))({}, element.type);

			if (element.props) {
				Object.keys(element.props).forEach(function(key) {
					brick.props[key] = element.props[key];
				});
			}
		} else {
			brick = exports.create(element.type, element.props);
		}

		composite.bricks.push(brick);
	});

	// Links.
	program.links.forEach(function(element) {
		composite.bricks[element[0]].outputs[element[1]].pipe(composite.bricks[element[2]].inputs[element[3]]);
	});

	// Inputs.
	if (program.inputs) {
		Object.keys(program.inputs).forEach(function(key) {
			composite.inputs[key] = new port.CompositePort();
			program.inputs[key].forEach(function(element) {
				composite.inputs[key].pipe(composite.bricks[element[0]].inputs[element[1]]);
			});
		});
	}

	// Outputs.
	if (program.outputs) {
		Object.keys(program.outputs).forEach(function(key) {
			composite.outputs[key] = new port.CompositePort();
			program.outputs[key].forEach(function(element) {
				composite.bricks[element[0]].outputs[element[1]].pipe(composite.outputs[key]);
			});
		});
	}

	// Props.
	if (props) {
		Object.keys(props).forEach(function(key) {
			var b = composite.bricks[program.props[key][0]];
			b.props[program.props[key][1]] = props[key];
		});
	}

	return composite;
};
