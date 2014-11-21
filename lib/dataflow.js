"use strict";

var assert = require("assert");

/*
 * Class Brick
 */
function Brick() {
	this.outputs = {};
	this.props = {};
}

Brick.prototype.inputs = {};

Brick.prototype.send = function(output, value) {
	this.outputs[output].forEach(function(element) {
		setImmediate(function() {
			element[0].receive(element[1], value);
		});
	});
};

Brick.prototype.receive = function(input, value) {
	this.inputs[input].call(this, value);
};

Brick.prototype.link = function(output) {
	return {
		to: function(to, input) {
			this.outputs[output].push([to, input]);
		}.bind(this)
	};
};

/*
 * Class Composite
 */
function Composite() {
	Brick.call(this);

	this.bricks = [];
	this.inputs = {};
}

Composite.prototype = Object.create(Brick.prototype);
Composite.prototype.constructor = Composite;

Composite.prototype.receive = function(input, value) {
	if (this.inputs[input]) {
		this.inputs[input].forEach(function(element) {
			element[0].receive(element[1], value);
		});
	} else {
		assert(this.outputs[input]);
		this.send(input, value);
	}
};

/*
 * Dataflow API
 */
exports.define = function(definition) {
	function NewBrick(props) {
		Brick.call(this);

		var self = this;
		NewBrick.prototype.outputs.forEach(function(element) {
			self.outputs[element] = [];
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
	NewBrick.prototype.inputs = definition.inputs || {};
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
			brick = new(require(element.type))();

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
		composite.bricks[element[0]].link(element[1]).to(composite.bricks[element[2]], element[3]);
	});

	// Inputs.
	if (program.inputs) {
		Object.keys(program.inputs).forEach(function(key) {
			composite.inputs[key] = [];
			program.inputs[key].forEach(function(element) {
				composite.inputs[key].push([composite.bricks[element[0]], element[1]]);
			});
		});
	}

	// Outputs.
	if (program.outputs) {
		Object.keys(program.outputs).forEach(function(key) {
			composite.outputs[key] = [];
			program.outputs[key].forEach(function(element) {
				composite.bricks[element[0]].link(element[1]).to(composite, key);
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
