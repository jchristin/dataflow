/* jshint expr: true */
/* global describe, it */

"use strict";

var dataflow = require("../lib/index"),
	port = require("../lib/port"),
	Multiply = require("./bricks/multiply");

describe("dataflow", function() {
	it("should create a brick", function() {
		var multiply = new Multiply();
		multiply.should.be.an.Object;
	});

	it("should send message", function(done) {
		var multiply = new Multiply(),
			inputPort = new port.InputPort(function(packet) {
				packet.data.should.be.equal(28);
				done();
			});

		multiply.outputs.product.pipe(inputPort);
		multiply.inputs.left.pushData(4);
		multiply.inputs.right.pushData(7);
	});

	it("should create a program with inputs and output", function(done) {
		dataflow.open("./test/programs/multiplier.json", function(err, brick) {
			var inputPort = new port.InputPort(function(packet) {
				packet.data.should.be.equal(35);
				done();
			});

			brick.outputs.third.pipe(inputPort);
			brick.inputs.second.pushData(7);
			brick.inputs.first.pushData(5);
		});
	});

	it("should execute a recursive program", function(done) {
		dataflow.open("./test/programs/factorial.flow", function(err, brick) {
			var inputPort = new port.InputPort(function(packet) {
				packet.data.should.be.equal(120);
				done();
			});

			brick.outputs.result.pipe(inputPort);
			brick.inputs.n.pushData(5);
		});
	});

	it("should execute a program with composite brick", function(done) {
		dataflow.open("./test/programs/composite.json", function(err, brick) {
			var inputPort = new port.InputPort(function(packet) {
				packet.data.should.be.equal(32);
				done();
			});

			brick.outputs.out.pipe(inputPort);
			brick.inputs.in.pushData(3);
		});
	});
});
