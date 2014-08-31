var dataflow = require("../../lib/dataflow");
require("../../bricks/misc.js");

describe("Brick", function () {
	describe("Starter", function () {
		it("should send a message on activate", function (done) {
			var starter = dataflow.create("Starter");
			var tester = dataflow.create("Tester");

			dataflow.testerDelegate = function (value) {
				value.should.be.true;
				done();
			};

			dataflow.link(starter, "start", tester, "test");
			dataflow.activate(starter, tester);
		});
	});

	describe("Messager", function () {
		it("should send its value", function (done) {
			var messager = dataflow.create("Messager", {
				message: 45
			});
			var tester = dataflow.create("Tester");

			dataflow.testerDelegate = function (value) {
				value.should.be.equal(45);
				done();
			};

			dataflow.link(messager, "message", tester, "test");
			dataflow.activate(messager, tester);

			messager.receive("send", true);
		});
	});
});
