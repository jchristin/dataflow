"use strict";

var dataflow = require("../../lib/index");

module.exports = dataflow.define({
	process: function() {
		if (this.inputs.input.hasData()) {
			this.outputs.output.pushData(this.inputs.input.popData() + this.props.step);
		}
	},
	inputs: ["input"],
	outputs: ["output"],
	props: {
		step: 1
	}
});
