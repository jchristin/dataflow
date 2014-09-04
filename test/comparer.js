"use strict";

var dataflow = require("../lib/dataflow");

module.exports = dataflow.define({
	inputs: {
		set_left: function (value) {
			if (value < this.props.right_value) {
				this.send("lesser", value);
			}

			if (value <= this.props.right_value) {
				this.send("lesser_or_equal", value);
			}

			if (value == this.props.right_value) {
				this.send("equal", value);
			}

			if (value >= this.props.right_value) {
				this.send("greater_or_equal", value);
			}

			if (value > this.props.right_value) {
				this.send("greater", value);
			}
		},
		set_right: function (value) {
			this.props.right_value = value;
		}
	},
	outputs: ["lesser", "lesser_or_equal", "equal", "greater_or_equal", "greater"]
});
