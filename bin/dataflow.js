#!/usr/bin/env node

"use strict";

var prompt = require("prompt"),
	port = require("../lib/port"),
	file = require("../lib/file"),
	argv = process.argv.slice(2);

if (argv.length > 0) {
	file.open(argv[0], function(err, brick) {
		if (err) {
			console.log(err);
		} else {
			Object.keys(brick.outputs).forEach(function(key) {
				var inputPort = new port.InputPort();
				inputPort.on("data", function() {
					console.log(key.grey + " ".grey + this.popData());
				});

				brick.outputs[key].pipe(inputPort);
			});

			prompt.start();
			prompt.message = "";
			prompt.delimiter = "";
			prompt.get(Object.keys(brick.inputs), function(err, result) {
				if (err) {
					console.log(err);
				} else {
					Object.keys(result).forEach(function(element) {
						var input = parseFloat(result[element]) || result[element];
						brick.inputs[element].write(input);
					});
				}
			});
		}
	});
}
