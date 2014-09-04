"use strict";

var dataflow = require("../lib/dataflow");

module.exports = dataflow.define({
	inputs: {
		send: function (value) {
			this.send("message", this.props.message);
		},
		set_message: function (value) {
			this.props.message = value;
		}
	},
	outputs: ["message"],
	props: {
		message: true
	}
});
