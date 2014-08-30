"use strict";

var dataflow = require("../lib/dataflow"),
	libxmljs = require("libxmljs");

/*
 * XMLParser
 */
dataflow.define("XMLParser", {
	inputs: {
		parse: function (value) {
			var xmlDoc = libxmljs.parseXml(value);
			var xmlNode = xmlDoc.get(this.path);
			if (xmlNode) {
				this.send("value", xmlNode.text());
			}
		}
	},
	outputs: ["value"],
	properties: {
		path: ""
	}
});
