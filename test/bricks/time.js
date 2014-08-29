var dataflow = require("../../lib/dataflow");
require("../../bricks/time.js");

describe("Brick", function () {
	describe("Clock", function () {
		it("should give the current hour", function (done) {
			var clock = dataflow.create("Clock");
			var tester = dataflow.create("Tester");

			dataflow.testerDelegate = function (value) {
				value.should.be.equal(new Date().getHours());
				done();
			};

			dataflow.link(clock, "hours", tester, "test");
			dataflow.activate(clock, tester);

			clock.receive("get_time", true);
		});

		it("should give the current minute", function (done) {
			var clock = dataflow.create("Clock");
			var tester = dataflow.create("Tester");

			dataflow.testerDelegate = function (value) {
				value.should.be.equal(new Date().getMinutes());
				done();
			};

			dataflow.link(clock, "minutes", tester, "test");
			dataflow.activate(clock, tester);

			clock.receive("get_time", true);
		});

		it("should give the current second", function (done) {
			var clock = dataflow.create("Clock");
			var tester = dataflow.create("Tester");

			dataflow.testerDelegate = function (value) {
				value.should.be.equal(new Date().getSeconds());
				done();
			};

			dataflow.link(clock, "seconds", tester, "test");
			dataflow.activate(clock, tester);

			clock.receive("get_time", true);
		});
	});

	describe("Timer", function () {
		it("should tick on activate", function (done) {
			var timer = dataflow.create("Timer");
			var tester = dataflow.create("Tester");

			dataflow.testerDelegate = function (value) {
				value.should.be.true;
				done();
			};

			dataflow.link(timer, "tick", tester, "test");
			dataflow.activate(timer, tester);
		});
	});
});
