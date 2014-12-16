"use strict";

var dataflow = require("../lib/dataflow");

module.exports = dataflow.define({
	process: function() {
		if (this.inputs.send.hasData()) {
			this.inputs.send.popData();
			this.outputs.message.pushData(this.props.message);
			console.log("message: " + this.props.message);
		}

		if (this.inputs.set_message.hasData()) {
			this.props.message = this.inputs.set_message.popData();
		}
	},
	inputs: ["send", "set_message"],
	outputs: ["message"],
	props: {
		message: true
	}
});
