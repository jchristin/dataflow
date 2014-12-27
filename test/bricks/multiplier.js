"use strict";

var dataflow = require("../../lib/index");

module.exports = dataflow.define({
	process: function() {
		if (this.inputs.left.hasData() && this.inputs.right.hasData()) {
			var product = this.inputs.left.popData() * this.inputs.right.popData();
			this.outputs.product.pushData(product);
		}
	},
	inputs: ["left", "right"],
	outputs: ["product"]
});
