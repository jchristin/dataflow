"use strict";

var dataflow = require("../../lib/index");

module.exports = dataflow.define({
	inputs: ["input"],
	outputs: ["output"],
	props: {
		step: 1
	},
	process: function() {
		var inPacket = this.inputs.input.popPacket();
		if (inPacket) {
			var outPacket = inPacket.clone(inPacket.data + this.props.step);
			this.outputs.output.pushPacket(outPacket);
		}
	}
});
