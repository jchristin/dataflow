var dataflow = require("../dataflow");

/*
 * Starter
 */
dataflow.define("Starter", {
	activate: function () {
		var self = this;
		setImmediate(function () {
			self.send("start", true);
		});
	},
	outputs: ["start"]
});

/*
 * Logger
 */
dataflow.define("Logger", {
	inputs: {
		log: function (value) {
			console.log(value);
		}
	}
});

/*
 * Messager
 */
dataflow.define("Messager", {
	inputs: {
		send: function (value) {
			this.send("message", this.message);
		},
		set_message: function (value) {
			this.message = value;
		}
	},
	outputs: ["message"],
	properties: {
		message: true
	}
});
