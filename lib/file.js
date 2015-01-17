"use strict";

var fs = require("fs"),
	path = require("path"),
	_ = require("lodash"),
	port = require("./port"),
	Composite = require("./brick").Composite;

exports.open = function(file) {
	file = path.resolve(file);
	return open(path.dirname(file), path.basename(file));
};

function open(dir, name) {
	var candidates = [
		path.join(dir, name),
		path.join(dir, name) + ".js",
		path.join(dir, name) + ".flow",
		path.join(dir, name) + ".json",
		path.join(dir, "node_modules", name) + ".js",
		path.join(dir, "node_modules", name) + ".flow",
		path.join(dir, "node_modules", name) + ".json",
		path.join(dir, "node_modules", name, "index.js"),
		path.join(dir, "node_modules", name, "index.flow"),
		path.join(dir, "node_modules", name, "index.json"),
		path.join(dir, "node_modules", name)
	];

	// Select the first existing file.
	var file = _.find(candidates, function(file) {
		return fs.existsSync(file);
	});

	if (file) {
		switch (path.extname(file)) {
			case ".js":
				return new(require(file))();

			case ".flow":
				return openFlow(file);

			case ".json":
				return loadJson(require(file), null);

			default:
				throw new Error("'" + file + "' is not supported.");
		}
	}

	throw new Error("Unable to find '" + name + "' in '" + dir + "'.");
}

function openFlow(file) {
	var data = fs.readFileSync(file, "utf8"),
		composites = {},
		mainComposite,
		composite,
		compositeName,
		compositeBody,
		bricks = {},
		brick,
		brickName,
		brickType,
		compositeMatch,
		compositeRegExp = /^COMPOSITE\s+(\w+)([^]+?)^END/gm,
		bodyMatch,
		bodyRegExp = /^\s*BRICKS([^]*)LINKS([^]*)PROPS([^]*)/,
		brickMatch,
		brickRegExp = /^\s*(\w+)\s+"(.+)"$/gm,
		linkMatch,
		linkRegExp = /^\s*(\w+).(\w+)\s*\|\s*(\w+).(\w+)\s*$/gm,
		propMatch,
		propRegExp = /^\s*(\w+)\.(\w+)\s+(.+)\s*$/gm;

	var link = function(from, output, to, input) {
		var brickFrom = bricks[from],
			brickTo = bricks[to],
			outputPort,
			inputPort;

		if (from !== "this" && !brickFrom) {
			throw new Error("The composite does not contain a brick called '" + from + "'.");
		}

		if (to !== "this" && !brickTo) {
			throw new Error("The composite does not contain a brick called '" + to + "'.");
		}

		if (from === "this") {
			outputPort = composite.inputs[output] || new port.CompositePort();
			composite.inputs[output] = outputPort;
			inputPort = brickTo.inputs[input];
		} else if (to === "this") {
			outputPort = brickFrom.outputs[output];
			inputPort = composite.outputs[input] || new port.CompositePort();
			composite.outputs[input] = inputPort;
		} else {
			outputPort = brickFrom.outputs[output];
			inputPort = brickTo.inputs[input];
		}

		if (!outputPort) {
			throw new Error("'" + from + "' does not contain an outout port called '" + output + "'.");
		}

		if (!inputPort) {
			throw new Error("'" + to + "' does not contain an input port called '" + input + "'.");
		}

		outputPort.pipe(inputPort);
	};

	// For each COMPOSITE in the file.
	while ((compositeMatch = compositeRegExp.exec(data)) !== null) {
		compositeName = compositeMatch[1];
		compositeBody = compositeMatch[2];

		composite = new Composite();
		composites[compositeName] = composite;

		if (compositeName === "Main") {
			mainComposite = composite;
		}

		bodyMatch = compositeBody.match(bodyRegExp);

		bricks = {};

		// BRICKS.
		while ((brickMatch = brickRegExp.exec(bodyMatch[1])) !== null) {
			brickName = brickMatch[1];
			brickType = brickMatch[2];

			bricks[brickName] = composites[brickType] || open(path.dirname(file), brickType);
		}

		// LINKS
		while ((linkMatch = linkRegExp.exec(bodyMatch[2])) !== null) {
			link(linkMatch[1], linkMatch[2], linkMatch[3], linkMatch[4]);
		}

		// PROPS.
		while ((propMatch = propRegExp.exec(bodyMatch[3])) !== null) {
			bricks[propMatch[1]].props[propMatch[2]] = JSON.parse("[" + propMatch[3] + "]")[0];
		}
	}

	if (mainComposite === undefined) {
		throw new Error("Unable to find the Main composite.");
	}

	return mainComposite;
}

function loadJson(data, props) {
	var composite = new Composite();

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
