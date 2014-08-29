var dataflow = require("../../lib/dataflow"),
	fs = require("fs");

require("../../bricks/xml.js");

describe("Brick", function () {
	describe("XMLParser", function () {
		it("should parse XML", function (done) {
			var xmlParser = dataflow.create("XMLParser");
			xmlParser.path = "/note/to";
			var tester = dataflow.create("Tester");

			dataflow.testerDelegate = function (value) {
				value.should.be.equal("Tove");
				done();
			};

			dataflow.link(xmlParser, "value", tester, "test");
			dataflow.activate(xmlParser, tester);

			xmlParser.receive("parse", fs.readFileSync("test/simple.xml", "utf8"));
		});
	});
});
