"use strict";

var dataflow = require("../../lib/index");

module.exports = dataflow.define({
	inputs: ["input"],
	process: function() {
		var inPacket = this.inputs.input.popPacket();
		if (inPacket) {
			console.log(inPacket.data);
		}
	}
});
