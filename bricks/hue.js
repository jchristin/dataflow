var dataflow = require("../lib/dataflow"),
	request = require("request");

/*
 * Hue
 */
dataflow.define("Hue", {
	activate: function () {
		request.post({
			url: "http://" + this.IP + "/api",
			json: {
				"username": this.userName,
				"devicetype": this.deviceType
			}
		}, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				console.log(body);
			}
			else {
				console.error(error);
			}
		});
	},
	inputs: {
		switch: function (value) {
			request.put({
				url: "http://" + this.IP + "/api/" + this.userName + "/lights/" + this.light + "/state",
				json: {
					"bri": 254,
					"on": this.state
				}
			}, function (error, response, body) {
				if (!error && response.statusCode == 200) {
					console.log(body);
				}
				else {
					console.error(error);
				}
			});

			this.state = !this.state;
		},
		set_hue: function (value) {
			request.put({
				url: "http://" + this.IP + "/api/" + this.userName + "/lights/" + this.light + "/state",
				json: {
					"hue": parseInt(value),
					"sat": 254
				}
			}, function (error, response, body) {
				if (!error && response.statusCode == 200) {
					console.log(body);
				}
				else {
					console.error(error);
				}
			});

			this.state = !this.state;
		}
	},
	properties: {
		IP: "localhost",
		light: 1,
		userName: "71a6b6f094346a8832df801c8428ea06", // MD5 "hue"
		hue: 0,
		state: true
	}
});
