"use strict";

var dataflow = require("../lib/dataflow"),
	request = require("request");

/*
 * Hue
 */
dataflow.define("Hue", {
	activate: function () {
		request.post({
			url: "http://" + this.props.IP + "/api",
			json: {
				"username": this.props.userName,
				"devicetype": this.props.deviceType
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
				url: "http://" + this.props.IP + "/api/" + this.props.userName + "/lights/" + this.props.light + "/state",
				json: {
					"bri": 254,
					"on": this.props.state
				}
			}, function (error, response, body) {
				if (!error && response.statusCode == 200) {
					console.log(body);
				}
				else {
					console.error(error);
				}
			});

			this.props.state = !this.props.state;
		},
		set_hue: function (value) {
			request.put({
				url: "http://" + this.props.IP + "/api/" + this.props.userName + "/lights/" + this.props.light + "/state",
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

			this.props.state = !this.props.state;
		}
	},
	props: {
		IP: "localhost",
		light: 1,
		userName: "71a6b6f094346a8832df801c8428ea06", // MD5 "hue"
		hue: 0,
		state: true
	}
});
