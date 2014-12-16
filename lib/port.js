"use strict";

var stream = require("stream"),
	util = require("util");

/*
 * InputPort
 */

util.inherits(InputPort, stream.Writable);

function InputPort() {
	stream.Writable.call(this, {
		objectMode: true
	});
}

InputPort.prototype._write = function(data, encoding, next) {
	this._data = data;
	this._next = next;

	this.emit("data");
};

InputPort.prototype.hasData = function() {
	return this._data !== undefined;
};

InputPort.prototype.getData = function() {
	return this._data;
};

InputPort.prototype.popData = function() {
	if (this.hasData()) {
		var data = this._data;
		var next = this._next;

		this._data = undefined;
		this._next = undefined;

		next();
		return data;
	}
};

/*
 * OutputPort
 */

util.inherits(OutputPort, stream.Readable);

function OutputPort() {
	stream.Readable.call(this, {
		objectMode: true
	});
}

OutputPort.prototype._read = function() {};

OutputPort.prototype.pushData = function(data) {
	this.push(data);
};

/*
 * CompositePort
 */

util.inherits(CompositePort, stream.Transform);

function CompositePort() {
	stream.Transform.call(this, {
		objectMode: true
	});
}

CompositePort.prototype._transform = function(data, encoding, callback) {
	this.push(data);
	callback();
};

exports.InputPort = InputPort;
exports.OutputPort = OutputPort;
exports.CompositePort = CompositePort;
