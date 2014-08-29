"use strict";

var dataflow = require("../lib/dataflow"),
	request = require("request");

/*
 * Req
 */
dataflow.define("Request", {
	inputs: {
		get: function (value) {
			request.get({
				url: this.url
			}, (function (error, response, body) {
				if (!error && response.statusCode == 200) {
					this.send("body", body);
				}
			}).bind(this));
		}
	},
	outputs: ["body"],
	properties: ["url"]
});
