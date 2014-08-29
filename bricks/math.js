var dataflow = require("../lib/dataflow");

/*
 * Adder
 */
dataflow.define("Adder", {
	inputs: {
		set_left: function (value) {
			this.send("sum", value + this.right_value);
		},
		set_right: function (value) {
			this.right_value = value;
		}
	},
	outputs: ["sum"],
	properties: {
		right_value: 0
	}
});

/*
 * Multiplier
 */
dataflow.define("Multiplier", {
	inputs: {
		set_left: function (value) {
			this.send("product", value * this.right_value);
		},
		set_right: function (value) {
			this.right_value = value;
		}
	},
	outputs: ["product"]
});

/*
 * Comparer
 */
dataflow.define("Comparer", {
	inputs: {
		set_left: function (value) {
			if (value < this.right_value) {
				this.send("lesser", value);
			}

			if (value <= this.right_value) {
				this.send("lesser_or_equal", value);
			}

			if (value == this.right_value) {
				this.send("equal", value);
			}

			if (value >= this.right_value) {
				this.send("greater_or_equal", value);
			}

			if (value > this.right_value) {
				this.send("greater", value);
			}
		},
		set_right: function (value) {
			this.right_value = value;
		}
	},
	outputs: ["lesser", "lesser_or_equal", "equal", "greater_or_equal", "greater"]
});
