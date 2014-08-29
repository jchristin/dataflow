var dataflow = require("../../dataflow");
require("../../bricks/request.js");

describe("Brick", function () {
	describe("Request", function () {
		it("should get url", function (done) {
			var request = dataflow.create("Request");
			request.url = "http://www.google.com";
			
			var tester = dataflow.create("Tester");

			dataflow.testerDelegate = function (value) {
				done();
			};

			dataflow.link(request, "body", tester, "test");
			dataflow.activate(request, tester);

			request.receive("get", true);
		});
	});
});
