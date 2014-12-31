/* jshint expr: true */
/* global describe, it */

"use strict";

var port = require("../lib/port");

describe("OutputPort", function() {
	it("should not send data if they are not connected", function() {
		var outputPort = new port.OutputPort();
		outputPort.pushData(1);
		outputPort._readableState.length.should.be.equal(0);
	});
});
