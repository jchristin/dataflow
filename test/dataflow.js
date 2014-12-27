/* jshint expr: true */
/* global describe, it */

"use strict";

var dataflow = require("../lib/index"),
	port = require("../lib/port"),
	Multiplier = require("./bricks/multiplier");

describe("dataflow", function() {
	it("should create a brick", function() {
		var multiplier = new Multiplier();
		multiplier.should.be.an.Object;
	});

	it("should send message", function(done) {
		var multiplier = new Multiplier(),
			inputPort = new port.InputPort(function(data) {
				data.should.be.equal(28);
				done();
			});

		multiplier.outputs.product.pipe(inputPort);
		multiplier.inputs.left.write(4);
		multiplier.inputs.right.write(7);
	});

	it("should create a program with inputs and output", function(done) {
		dataflow.open("./test/programs/multiplier.json", function(err, brick) {
			var inputPort = new port.InputPort(function(data) {
				data.should.be.equal(35);
				done();
			});

			brick.outputs.third.pipe(inputPort);
			brick.inputs.second.write(7);
			brick.inputs.first.write(5);
		});
	});

	it("should execute a recursive program", function(done) {
		dataflow.open("./test/programs/factorial.json", function(err, brick) {
			var inputPort = new port.InputPort(function(data) {
				data.should.be.equal(120);
				done();
			});

			brick.outputs.result.pipe(inputPort);
			brick.inputs.n.write(5);
		});
	});

	it("should execute a program with composite brick", function(done) {
		dataflow.open("./test/programs/composite.json", function(err, brick) {
			var inputPort = new port.InputPort(function(data) {
				data.should.be.equal(32);
				done();
			});

			brick.outputs.out.pipe(inputPort);
			brick.inputs.in.write(3);
		});
	});
});
