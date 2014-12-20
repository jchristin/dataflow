"use strict";

var fs = require("fs"),
	port = require("./port"),
	dataflow = require("./dataflow");

exports.open = function(path, callback) {
	fs.readFile(path, "utf8", function(err, data) {
		var composite = new dataflow.Composite(),
			bricks = {},
			matches = data.match(/BRICKS([^]*)LINKS([^]*)PROPS([^]*)/),
			brickMatch,
			brickRegExp = /^(\w+)\s+"(.+\/[^\/]+)"$/gm,
			linkMatch,
			linkRegExp = /^\s*(\w+).(\w+)\s*\|\s*(\w+).(\w+)\s*$/gm,
			propMatch,
			propRegExp = /^\s*(\w+)\s+(\w+)\s+(.+)\s*$/gm;

		while ((brickMatch = brickRegExp.exec(matches[1])) !== null) {
			bricks[brickMatch[1]] = new(require(brickMatch[2]))();
		}

		while ((linkMatch = linkRegExp.exec(matches[2])) !== null) {
			if (linkMatch[1] === "this") {
				var inCompositePort = composite.inputs[linkMatch[2]] || new port.CompositePort();
				inCompositePort.pipe(bricks[linkMatch[3]].inputs[linkMatch[4]]);
				composite.inputs[linkMatch[2]] = inCompositePort;
			} else if (linkMatch[3] === "this") {
				var outCompositePort = composite.outputs[linkMatch[4]] || new port.CompositePort();
				bricks[linkMatch[1]].outputs[linkMatch[2]].pipe(outCompositePort);
				composite.outputs[linkMatch[2]] = outCompositePort;
			} else {
				var outputPort = bricks[linkMatch[1]].outputs[linkMatch[2]],
					inputPort = bricks[linkMatch[3]].inputs[linkMatch[4]];

				outputPort.pipe(inputPort);
			}
		}

		while ((propMatch = propRegExp.exec(matches[3])) !== null) {
			if (propMatch[1] === "this") {
			} else {
				bricks[propMatch[1]].props[propMatch[2]] = JSON.parse("[" + propMatch[3]+ "]")[0];
			}
		}

		if (callback) {
			callback(composite);
		}
	});
};
