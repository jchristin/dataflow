"use strict";

var dataflow = require("../lib/dataflow");

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
