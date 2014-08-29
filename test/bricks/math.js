var dataflow = require("../../dataflow");
require("../../bricks/math.js");

describe("Brick", function () {
	describe("Adder", function () {
		it("should add two numbers", function (done) {
			var adder = dataflow.create("Adder");
			var tester = dataflow.create("Tester");

			dataflow.testerDelegate = function (value) {
				value.should.be.equal(8);
				done();
			};

			dataflow.link(adder, "sum", tester, "test");
			dataflow.activate(adder, tester);

			adder.receive("set_right", 3);
			adder.receive("set_left", 5);
		});
	});
	
	describe("Multiplier", function () {
		it("should multiply two numbers", function (done) {
			var multiplier = dataflow.create("Multiplier");
			var tester = dataflow.create("Tester");

			dataflow.testerDelegate = function (value) {
				value.should.be.equal(15);
				done();
			};

			dataflow.link(multiplier, "product", tester, "test");
			dataflow.activate(multiplier, tester);

			multiplier.receive("set_right", 3);
			multiplier.receive("set_left", 5);
		});
	});
	
	describe("Comparer", function () {
		it("should compare two numbers (lesser)", function (done) {
			var comparer = dataflow.create("Comparer");
			var tester = dataflow.create("Tester");
			var killer = dataflow.create("Killer");

			dataflow.link(comparer, "lesser", tester, "test");
			dataflow.link(comparer, "lesser_or_equal", tester, "test");
			dataflow.link(comparer, "equal", killer, "kill");
			dataflow.link(comparer, "greater_or_equal", killer, "kill");
			dataflow.link(comparer, "greater", killer, "kill");
			dataflow.activate(comparer, tester, killer);

			var callCount = 0;
			dataflow.testerDelegate = function (value) {
				value.should.be.equal(2);

				callCount++;
				if (callCount >= 2) {
					done();
				}
			};

			comparer.receive("set_right", 3);
			comparer.receive("set_left", 2);
		});

		it("should compare two numbers (equal)", function (done) {
			var comparer = dataflow.create("Comparer");
			var tester = dataflow.create("Tester");
			var killer = dataflow.create("Killer");

			dataflow.link(comparer, "lesser", killer, "kill");
			dataflow.link(comparer, "lesser_or_equal", tester, "test");
			dataflow.link(comparer, "equal", tester, 'test');
			dataflow.link(comparer, "greater_or_equal", tester, "test");
			dataflow.link(comparer, "greater", killer, "kill");
			dataflow.activate(comparer, tester, killer);

			var callCount = 0;
			dataflow.testerDelegate = function (value) {
				value.should.be.equal(5);

				callCount++;
				if (callCount >= 3) {
					done();
				}
			};

			comparer.receive("set_right", 5);
			comparer.receive("set_left", 5);
		});

		it("should compare two numbers (greater)", function (done) {
			var comparer = dataflow.create("Comparer");
			var tester = dataflow.create("Tester");
			var killer = dataflow.create("Killer");

			dataflow.link(comparer, "lesser", killer, "kill");
			dataflow.link(comparer, "lesser_or_equal", killer, "kill");
			dataflow.link(comparer, "equal", killer, "kill");
			dataflow.link(comparer, "greater_or_equal", tester, "test");
			dataflow.link(comparer, "greater", tester, "test");
			dataflow.activate(comparer, tester, killer);

			var callCount = 0;
			dataflow.testerDelegate = function (value) {
				value.should.be.equal(8);

				callCount++;
				if (callCount >= 2) {
					done();
				}
			};

			comparer.receive("set_right", 5);
			comparer.receive("set_left", 8);
		});
	});
});
