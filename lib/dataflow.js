"use strict";

var assert = require("assert");

/*
 * Class Brick
 */
function Brick() {
	this.active = null;
	this.outputs = {};
}

Brick.prototype.inputs = {};

Brick.prototype.activate = function () {
	this.active = true;
	return;
};

Brick.prototype.deactivate = function () {
	this.active = false;
	return;
};

Brick.prototype.send = function (output, value) {
	if (this.active) {
		this.outputs[output].forEach(function (element) {
			setImmediate(function () {
				element[0].receive(element[1], value);
			});
		});
	}
};

Brick.prototype.receive = function (input, value) {
	if (this.active) {
		this.inputs[input].call(this, value);
	}
};

Brick.constructors = {};

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

Composite.prototype.activate = function () {
	Brick.prototype.activate.call(this);

	this.bricks.forEach(function (element) {
		element.activate();
	});
};

Composite.prototype.deactivate = function () {
	Brick.prototype.deactivate.call(this);

	this.bricks.forEach(function (element) {
		element.deactivate();
	});
};

Composite.prototype.receive = function (input, value) {
	if (this.inputs[input]) {
		this.inputs[input].forEach(function (element) {
			element[0].receive(element[1], value);
		});
	}
	else {
		assert(this.outputs[input]);
		this.send(input, value);
	}
};

/*
 * Dataflow API
 */
exports.getBricks = function () {
	var description = {};

	Object.keys(Brick.constructors).forEach(function (key) {
		var brick = Brick.constructors[key];

		description[key] = {
			inputs: Object.keys(brick.prototype.inputs),
			outputs: brick.prototype.outputs.slice(),
			properties: brick.prototype.properties,
		};
	});

	return description;
};

exports.define = function (type, definition) {
	function NewBrick() {
		Brick.call(this);

		var self = this;
		NewBrick.prototype.outputs.forEach(function (element) {
			self.outputs[element] = [];
		});

		Object.keys(NewBrick.prototype.properties).forEach(function (key) {
			self[key] = NewBrick.prototype.properties[key];
		});
	}

	if (Brick.constructors[type] !== undefined) {
		throw new Error(type + " have already be defined.");
	}

	NewBrick.prototype = Object.create(Brick.prototype);
	NewBrick.prototype.constructor = NewBrick;
	Brick.constructors[type] = NewBrick;

	if (definition.activate) {
		NewBrick.prototype.activate = function () {
			Brick.prototype.activate.call(this);
			definition.activate.call(this);
		};
	}

	if (definition.deactivate) {
		NewBrick.prototype.deactivate = function () {
			Brick.prototype.deactivate.call(this);
			definition.deactivate.call(this);
		};
	}

	NewBrick.prototype.inputs = definition.inputs || {};
	NewBrick.prototype.outputs = definition.outputs || [];
	NewBrick.prototype.properties = definition.properties || {};
};

exports.create = function (type) {
	if (typeof type === "string") {
		var Constructor = Brick.constructors[type];

		if (Constructor === undefined) {
			throw new Error("Invalid brick type: " + type);
		}

		return new Constructor();
	}

	return createComposite(type);
};

exports.link = function (from, output, to, input) {
	from.outputs[output].push([to, input]);
};

exports.activate = function () {
	for (var i = 0; i < arguments.length; i++) {
		arguments[i].activate();
	}
};

exports.deactivate = function () {
	for (var i = 0; i < arguments.length; i++) {
		arguments[i].deactivate();
	}
};

var createComposite = function (program) {
	var composite = new Composite();

	program.bricks.forEach(function (element) {
		var brick = exports.create(element.type);

		if (element.properties) {
			Object.keys(element.properties).forEach(function (key) {
				brick[key] = element.properties[key];
			});
		}

		composite.bricks.push(brick);
	});

	program.links.forEach(function (element) {
		exports.link(composite.bricks[element[0]], element[1], composite.bricks[element[2]], element[3]);
	});

	if (program.inputs) {
		Object.keys(program.inputs).forEach(function (key) {
			composite.inputs[key] = [];
			program.inputs[key].forEach(function (element) {
				composite.inputs[key].push([composite.bricks[element[0]], element[1]]);
			});
		});
	}

	if (program.outputs) {
		Object.keys(program.outputs).forEach(function (key) {
			composite.outputs[key] = [];
			program.outputs[key].forEach(function (element) {
				exports.link(composite.bricks[element[0]], element[1], composite, key);
			});
		});
	}

	return composite;
};
