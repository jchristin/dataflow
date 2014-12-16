"use strict";

var dataflow = require("../lib/dataflow");

module.exports = dataflow.define({
	process: function() {
		while (this.inputs.left.hasData() && this.inputs.right.hasData()) {
			this.outputs.sum.pushData(this.inputs.left.popData() + this.inputs.right.popData());
		}
	},
	inputs: ["left", "right"],
	outputs: ["sum"]
});
