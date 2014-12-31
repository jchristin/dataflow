"use strict";

var dataflow = require("../../lib/index");

module.exports = dataflow.define({
	inputs: ["left"],
	outputs: ["lesser", "lesserOrEqual", "equal", "greaterOrEqual", "greater"],
	props: {
		right: 0
	},
	process: function() {
		var inPacket = this.inputs.left.popPacket();
		if (inPacket) {
			var outPacket = inPacket.clone();

			if (inPacket.data < this.props.right) {
				this.outputs.lesser.pushPacket(outPacket);
			}

			if (inPacket.data <= this.props.right) {
				this.outputs.lesserOrEqual.pushPacket(outPacket);
			}

			if (inPacket.data == this.props.right) {
				this.outputs.equal.pushPacket(outPacket);
			}

			if (inPacket.data >= this.props.right) {
				this.outputs.greaterOrEqual.pushPacket(outPacket);
			}

			if (inPacket.data > this.props.right) {
				this.outputs.greater.pushPacket(outPacket);
			}
		}
	}
});
