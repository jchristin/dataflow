"use strict";

var dataflow = require("../../lib/index");

module.exports = dataflow.define({
	process: function() {
		if (this.inputs.input.hasData()) {
			console.log(this.inputs.input.popData());
		}
	},
	inputs: ["input"]
});
