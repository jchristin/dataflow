"use strict";

var dataflow = require("../../lib/index");

module.exports = dataflow.define({
	inputs: ["input"],
	outputs: ["selected", "rejected"],
	props: {
		key: null
	},
	process: function() {
		var inPacket = this.inputs.input.popPacket();
		if (inPacket) {
			if (inPacket[this.props.key] !== undefined) {
				this.outputs.selected.pushPacket(inPacket.clone());
			} else {
				this.outputs.rejected.pushPacket(inPacket.clone());
			}
		}
	}
});
