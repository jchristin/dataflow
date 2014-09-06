/* jshint expr: true */
/* global describe, it */

"use strict";

var dataflow = require("../lib/dataflow"),
	Tester = require("./tester");

describe("dataflow", function () {
	it("should create a brick", function () {
		var tester = new Tester();
		tester.should.be.an.Object;
		tester.props.should.have.property("property", "default value");
	});

	it("should create a program with inputs and output", function (done) {
		var brick = dataflow.create(require("./programs/program002.json"));
		var tester = new Tester();

		dataflow.testerDelegate = function (value) {
			value.should.be.equal(12);
			done();
		};

		dataflow.link(brick, "third", tester, "test");

		brick.receive("second", 7);
		brick.receive("first", 5);
	});

	it("should execute a recursive program", function (done) {
		var brick = dataflow.create(require("./programs/program003.json"));
		var tester = new Tester();

		dataflow.testerDelegate = function (value) {
			value.should.be.equal(120);
			done();
		};

		dataflow.link(brick, "result", tester, "test");
	
		brick.receive("n", 5);
	});
});
