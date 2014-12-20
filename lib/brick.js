"use strict";

var util = require("util"),
	stream = require("stream"),
	port = require("./port");

/*
 * Class Brick
 */

exports.Brick = Brick;

function Brick() {
	this.inputs = {};
	this.outputs = {};
	this.props = {};
}

/*
 * Class Composite
 */

exports.Composite = Composite;
util.inherits(Composite, Brick);

function Composite() {
	Brick.call(this);
	this.bricks = [];
}

/*
 * Dataflow API
 */
exports.define = function(definition) {
	function NewBrick(props) {
		Brick.call(this);

		var processing = false;
		var needProcessing = false;
		var self = this;

		NewBrick.prototype.inputs.forEach(function(element) {
			self.inputs[element] = new port.InputPort();
			self.inputs[element].on("data", function() {
				needProcessing = true;
				while(needProcessing && !processing) {
					needProcessing = false;
					processing = true;
					definition.process.call(self);
					processing = false;
				}
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

	util.inherits(NewBrick, Brick);
	NewBrick.prototype.inputs = definition.inputs || [];
	NewBrick.prototype.outputs = definition.outputs || [];
	NewBrick.prototype.props = definition.props || {};

	return NewBrick;
};
