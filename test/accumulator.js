"use strict";

var dataflow = require("../lib/index");

module.exports = dataflow.define({
	process: function() {
		if (this.inputs.input.hasData()) {
			var data = this.inputs.input.popData();
			if (data === this.props.end) {
				this.outputs.output.pushData(this.lastData);
			}

			this.lastData = data;
		}
	},
	inputs: ["input"],
	outputs: ["output"],
	props: {
		end: 0
	}
});
