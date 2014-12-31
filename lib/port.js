"use strict";

var stream = require("stream"),
	util = require("util"),
	Packet = require("./packet");

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

InputPort.prototype._write = function(packet, encoding, next) {
	this._packet = packet;
	this._next = next;

	if (this._callback) {
		this._callback(packet);
	}
};

InputPort.prototype.pushPacket = function(packet) {
	this.write(packet);
};

InputPort.prototype.pushData = function(data) {
	this.pushPacket(new Packet(data));
};

InputPort.prototype.hasPacket = function() {
	return this._packet !== undefined;
};

InputPort.prototype.getPacket = function() {
	return this._packet;
};

InputPort.prototype.popPacket = function() {
	if (this.hasPacket()) {
		var packet = this._packet;
		var next = this._next;

		this._packet = undefined;
		this._next = undefined;

		next();
		return packet;
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

OutputPort.prototype.pushPacket = function(packet) {
	if (this._readableState.pipesCount > 0) {
		this.push(packet);
	}
};

OutputPort.prototype.pushData = function(data) {
	this.pushPacket(new Packet(data));
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

CompositePort.prototype._transform = function(packet, encoding, callback) {
	this.push(packet);
	callback();
};

CompositePort.prototype.pushPacket = function(packet) {
	this.write(packet);
};

CompositePort.prototype.pushData = function(data) {
	this.pushPacket(new Packet(data));
};
