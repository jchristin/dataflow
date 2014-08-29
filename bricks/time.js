var dataflow = require("../lib/dataflow");

/*
 * Clock
 */
dataflow.define("Clock", {
	inputs: {
		get_time: function (value) {
			var now = new Date();
			this.send("hours", now.getHours());
			this.send("minutes", now.getMinutes());
			this.send("seconds", now.getSeconds());
		}
	},
	outputs: ["hours", "minutes", "seconds"]
});

/*
 * Timer
 */
dataflow.define("Timer", {
	activate: function () {
		this.intervalObject = setInterval( this.send("tick", true), this.delay);
	},
	deactivate: function () {
		clearInterval(this.intervalObject);
	},
	outputs: ["tick"],
	properties: {
		delay: 1000
	}
});
