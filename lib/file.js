"use strict";

var fs = require("fs"),
	path = require("path"),
	port = require("./port"),
	brick = require("./brick");

exports.open = function(file, callback) {
	fs.readFile(file, "utf8", function(err, data) {
		if (err) {
			callback(err);
		}

		switch (path.extname(file)) {
			case ".flow":
				callback(null, loadFlow(data, null));
				break;
			case ".json":
				callback(null, loadJson(JSON.parse(data), null));
				break;
			default:
				callback(new Error("File not supported"));
		}
	});
};

function loadFlow(data, props) {
	var composite = new brick.Composite(),
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
			composite.outputs[linkMatch[4]] = outCompositePort;
		} else {
			var outputPort = bricks[linkMatch[1]].outputs[linkMatch[2]],
				inputPort = bricks[linkMatch[3]].inputs[linkMatch[4]];

			outputPort.pipe(inputPort);
		}
	}

	while ((propMatch = propRegExp.exec(matches[3])) !== null) {
		if (propMatch[1] === "this") {} else {
			bricks[propMatch[1]].props[propMatch[2]] = JSON.parse("[" + propMatch[3] + "]")[0];
		}
	}

	return composite;
}

function loadJson(data, props) {
	var composite = new brick.Composite();

	// Bricks.
	data.bricks.forEach(function(element) {
		var brick;

		if (typeof element.type === "string") {
			brick = new(require(element.type))();

			if (element.props) {
				Object.keys(element.props).forEach(function(key) {
					brick.props[key] = element.props[key];
				});
			}
		} else {
			brick = loadJson(element.type, element.props);
		}

		composite.bricks.push(brick);
	});

	// Links.
	data.links.forEach(function(element) {
		composite.bricks[element[0]].outputs[element[1]].pipe(composite.bricks[element[2]].inputs[element[3]]);
	});

	// Inputs.
	if (data.inputs) {
		Object.keys(data.inputs).forEach(function(key) {
			composite.inputs[key] = new port.CompositePort();
			data.inputs[key].forEach(function(element) {
				composite.inputs[key].pipe(composite.bricks[element[0]].inputs[element[1]]);
			});
		});
	}

	// Outputs.
	if (data.outputs) {
		Object.keys(data.outputs).forEach(function(key) {
			composite.outputs[key] = new port.CompositePort();
			data.outputs[key].forEach(function(element) {
				composite.bricks[element[0]].outputs[element[1]].pipe(composite.outputs[key]);
			});
		});
	}

	// Props.
	if (props) {
		Object.keys(props).forEach(function(key) {
			var b = composite.bricks[data.props[key][0]];
			b.props[data.props[key][1]] = props[key];
		});
	}

	return composite;
}
