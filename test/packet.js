/* jshint expr: true */
/* global describe, it */

"use strict";

var Packet = require("../lib/packet");

describe("Packet", function() {
	it("should clone a packet", function() {
		var packetA = new Packet(1),
			packetB = packetA.clone(2);

		packetB.should.be.an.instanceOf(Packet);
		packetB.data.should.be.equal(2);
	});

	it("should clone multiple packets", function() {
		var packetA = new Packet(1),
			packetB = new Packet("A"),
			packetC;

		packetA.key1 = true;
		packetB.key2 = true;

		packetC = Packet.clone(packetA, packetB);

		packetC.should.be.an.instanceOf(Packet);
		packetC.should.have.properties("key1", "key2");
		(packetC.data === null).should.be.true;
	});
});
