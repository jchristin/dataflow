"use strict";

var dataflow = require("../lib/dataflow");

module.exports = dataflow.define({
	process: function() {
		if (this.inputs.compare.hasData()) {
			var value = this.inputs.compare.popData();

			if (value < this.props.right_value) {
				this.outputs.lesser.pushData(value);
			}

			if (value <= this.props.right_value) {
				this.outputs.lesser_or_equal.pushData(value);
			}

			if (value == this.props.right_value) {
				this.outputs.equal.pushData(value);
			}

			if (value >= this.props.right_value) {
				this.outputs.greater_or_equal.pushData(value);
			}

			if (value > this.props.right_value) {
				this.outputs.greater.pushData(value);
			}
		}
	},
	inputs: ["compare"],
	outputs: ["lesser", "lesser_or_equal", "equal", "greater_or_equal", "greater"],
	props: {
		right_value: 0
	}
});
