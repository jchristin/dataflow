"use strict";

var dataflow = require("../lib/dataflow");

module.exports = dataflow.define({
	inputs: {
		set_left: function (value) {
			this.send("sum", value + this.props.right_value);
		},
		set_right: function (value) {
			this.props.right_value = value;
		}
	},
	outputs: ["sum"],
	props: {
		right_value: 0
	}
});
