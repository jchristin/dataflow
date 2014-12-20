"use strict";

var dataflow = require("../lib/index");

module.exports = dataflow.define({
	process: function() {
		if (this.inputs.test.hasData()) {
			this.props.delegate(this.inputs.test.popData());
		}
	},
	inputs: ["test"],
	props: {
		property: "default value"
	}
});
