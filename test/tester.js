"use strict";

var dataflow = require("../lib/dataflow");

module.exports = dataflow.define({
	inputs: {
		test: function(value) {
			this.props.delegate(value);
		}
	},
	props: {
		property: "default value"
	}
});
