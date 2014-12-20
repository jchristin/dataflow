/* jshint expr: true */
/* global describe, it */

"use strict";

var dataflow = require("../lib/index"),
	Tester = require("./tester"),
	Adder = require("./adder");

describe("dataflow", function() {
	it("should create a brick", function() {
		var tester = new Tester();
		tester.should.be.an.Object;
		tester.props.should.have.property("property", "default value");
	});

	it("should connect two brick", function(done) {
		var adder = new Adder(),
			tester = new Tester({
				delegate: function(value) {
					value.should.be.equal(11);
					done();
				}
			});

		adder.outputs.sum.pipe(tester.inputs.test);
		adder.inputs.left.write(4);
		adder.inputs.right.write(7);
	});

	it("should create a program with inputs and output", function(done) {
		dataflow.open("./test/programs/adder.json", function(err, brick) {
			var tester = new Tester({
				delegate: function(value) {
					value.should.be.equal(12);
					done();
				}
			});

			brick.outputs.third.pipe(tester.inputs.test);
			brick.inputs.second.write(7);
			brick.inputs.first.write(5);
		});
	});

	it("should execute a recursive program", function(done) {
		dataflow.open("./test/programs/factorial.json", function(err, brick) {
			var tester = new Tester({
				delegate: function(value) {
					value.should.be.equal(120);
					done();
				}
			});

			brick.outputs.result.pipe(tester.inputs.test);
			brick.inputs.n.write(5);
		});
	});

	it("should execute a program with composite brick", function(done) {
		dataflow.open("./test/programs/composite.json", function(err, brick) {
			var tester = new Tester({
				delegate: function(value) {
					value.should.be.equal(29);
					done();
				}
			});

			brick.outputs.out.pipe(tester.inputs.test);
			brick.inputs.in.write(3);
		});
	});
});
