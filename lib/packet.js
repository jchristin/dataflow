"use strict";

var _ = require("lodash");

/*
 * Packet
 */

module.exports = Packet;

function Packet(data) {
	this.data = data || null;
}

Packet.clone = function() {
	var packet = new Packet();

	for (var i = 0; i < arguments.length; i++) {
		if (!arguments[i] instanceof Packet) {
			throw new Error("Packet can only clone packets");
		}

		_.merge(packet, arguments[i]);
	}

	packet.data = null;
	return packet;
};

Packet.prototype.clone = function(data) {
	var packet = _.merge(new Packet(), this);

	if (data !== undefined) {
		packet.data = data;
	}

	return packet;
};

Packet.prototype.data = function(data) {
	this.data = data;
	return this;
};
