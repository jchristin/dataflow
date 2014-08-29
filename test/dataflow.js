var dataflow = require("../dataflow");
require("../bricks/math.js");
require("../bricks/misc.js");

dataflow.define("Tester", {
	inputs: {
		test: function (value) {
			dataflow.testerDelegate(value);
		}
	},
	properties: {
		property: "default value"
	}
});

dataflow.define("Killer", {
	inputs: {
		kill: function (value) {
			throw new Error("KILL");
		}
	}
});

describe("dataflow", function () {
	it("should get a description of all available bricks", function () {
		var desc = dataflow.getBricks();
		desc.should.have.properties("Tester", "Killer");

		Object.keys(desc).forEach(function (key) {
			desc[key].should.have.properties("inputs", "outputs", "properties");
			desc[key].inputs.should.be.an.Array;
			desc[key].outputs.should.be.an.Array;
			desc[key].properties.should.be.an.Object;
		});
	});

	it("should create a brick from type", function () {
		var tester = dataflow.create("Tester");
		tester.should.be.an.Object;
		tester.should.have.property("property", "default value");
	});

	it("should create a composite brick from program", function (done) {
		var brick = dataflow.create(require("./programs/program001.json"));
		brick.should.be.an.Object;

		dataflow.testerDelegate = function (value) {
			value.should.be.equal(78);
			done();
		};

		brick.activate();
	});

	it("should create a program with inputs and output", function (done) {
		var brick = dataflow.create(require("./programs/program002.json"));
		var tester = dataflow.create("Tester");

		dataflow.testerDelegate = function (value) {
			value.should.be.equal(12);
			done();
		};

		dataflow.link(brick, "third", tester, "test");
		dataflow.activate(brick, tester);

		brick.receive("second", 7);
		brick.receive("first", 5);
	});

	it("should execute a recursive program", function (done) {
		var brick = dataflow.create(require("./programs/program003.json"));
		var tester = dataflow.create("Tester");

		dataflow.testerDelegate = function (value) {
			value.should.be.equal(120);
			done();
		};

		dataflow.link(brick, "result", tester, "test");
		dataflow.activate(brick, tester);

		brick.receive("n", 5);
	});

});
