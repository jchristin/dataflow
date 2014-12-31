"use strict";

var dataflow = require("../../lib/index");

module.exports = dataflow.define({
	inputs: ["left", "right"],
	outputs: ["product"],
	process: function() {
		if (this.inputs.left.hasPacket() && this.inputs.right.hasPacket()) {
			var leftPacket = this.inputs.left.popPacket(),
				rightPacket = this.inputs.right.popPacket(),
				outPacket = dataflow.Packet.clone(leftPacket, rightPacket);

			outPacket.data = leftPacket.data * rightPacket.data;
			this.outputs.product.pushPacket(outPacket);
		}
	}
});
