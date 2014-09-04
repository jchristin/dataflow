"use strict";

var dataflow = require("../lib/dataflow");

module.exports = dataflow.define({
	inputs: {
		test: function (value) {
			dataflow.testerDelegate(value);
		}
	},
	props: {
		property: "default value"
	}
});
