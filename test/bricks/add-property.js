"use strict";

var dataflow = require("../../lib/index");

module.exports = dataflow.define({
	inputs: ["input"],
	outputs: ["output"],
	props: {
		key: "key",
		value: true
	},
	process: function() {
		var inPacket = this.inputs.input.popPacket();
		if (inPacket) {
			var outPacket = inPacket.clone();
			outPacket[this.props.key] = this.props.value;
			this.outputs.output.pushPacket(outPacket);
		}
	}
});
