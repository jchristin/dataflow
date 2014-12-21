"use strict";

var stream = require("stream"),
	util = require("util");

/*
 * InputPort
 */

exports.InputPort = InputPort;
util.inherits(InputPort, stream.Writable);

function InputPort(callback) {
	stream.Writable.call(this, {
		objectMode: true
	});

	this._callback = callback;
}

InputPort.prototype._write = function(data, encoding, next) {
	this._data = data;
	this._next = next;

	if (this._callback) {
		this._callback(data);
	}
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

exports.OutputPort = OutputPort;
util.inherits(OutputPort, stream.Readable);

function OutputPort() {
	stream.Readable.call(this, {
		objectMode: true
	});
}

OutputPort.prototype._read = function() {};

OutputPort.prototype.pushData = function(data) {
	if (this._readableState.pipesCount > 0) {
		this.push(data);
	}
};

/*
 * CompositePort
 */

exports.CompositePort = CompositePort;
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
