#!/usr/bin/env node

"use strict";

var prompt = require("prompt"),
	Packet = require("../lib/packet"),
	port = require("../lib/port"),
	file = require("../lib/file"),
	argv = process.argv.slice(2);

if (argv.length > 0) {
	var brick = file.open(argv[0]);
	Object.keys(brick.outputs).forEach(function(key) {
		var inputPort = new port.InputPort(function(packet) {
			console.log(key.grey + " ".grey + packet.data);
			this.popPacket();
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
				brick.inputs[element].pushData(input);
			});
		}
	});
}
