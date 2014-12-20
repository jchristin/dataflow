"use strict";

var dataflow = require("../lib/index");

module.exports = dataflow.define({
	process: function() {
		if (this.inputs.left.hasData() && this.inputs.right.hasData()) {
			this.outputs.sum.pushData(this.inputs.left.popData() + this.inputs.right.popData());
		}
	},
	inputs: ["left", "right"],
	outputs: ["sum"]
});
