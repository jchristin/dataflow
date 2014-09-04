"use strict";

var dataflow = require("../lib/dataflow");

module.exports = dataflow.define({
	inputs: {
		set_left: function (value) {
			this.send("product", value * this.props.right_value);
		},
		set_right: function (value) {
			this.props.right_value = value;
		}
	},
	outputs: ["product"]
});
