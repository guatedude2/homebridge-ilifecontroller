/*
    TERMS OF USE
    Open source under the MIT License.
    Copyright 2016 Matthijs Logemann All rights reserved.
*/
module.exports = init;

var superagent = require('superagent');
var Service = null;
var Characteristic = null;

function init(homebridge) {
	Service = homebridge.hap.Service;
	Characteristic = homebridge.hap.Characteristic;
	homebridge.registerAccessory('homebridge-ilifecontroller', 'iLife Vacuum', ILifeController);
}

function ILifeController(log, config) {
	this.log = log;
	var that = this;

	this.name = config.name;
	this.ip_address = config.ip_address;
	this.username = config.username;
	this.password = config.password;
	this.dock_on_stop = (typeof config.dock_on_stop === 'undefined' || config.dock_on_stop === "true");

	this.informationService = new Service.AccessoryInformation();
	this.informationService.setCharacteristic(Characteristic.Name, this.name)
		.setCharacteristic(Characteristic.Manufacturer, "ShenZhen Technology Co")
		.setCharacteristic(Characteristic.Model, "iLife Robotic Vacuum Cleaner")
		.setCharacteristic(Characteristic.SerialNumber, "Unknown")
		.setCharacteristic(Characteristic.FirmwareRevision, "Unknown");

	getSWVersion.call(this);
}

var getSWVersion = function() {
	var that = this;
	//		that.informationService.setCharacteristic(Characteristic.SerialNumber, "Loading!");
	var credentials = this.username && this.password ? that.username+":"+that.password+"@" : "";
	superagent.get("http://"+credentials+that.ip_address+"/api/info").timeout(60000).end(function(error, response) {
		if (error) {
			that.log("Could not load info: %s", error.message);
			//				that.informationService.setCharacteristic(Characteristic.SerialNumber, "Unknown!");
		} else {
			var tcObj = JSON.parse(response.text);
			that.log(tcObj.info.firmwareVersion);
			//				that.informationService.setCharacteristic(Characteristic.SerialNumber, "Loaded!");
		}
	});
}

ILifeController.prototype = {
	setPowerState: function(powerOn, callback) {
		if (powerOn) {
			this.log(this.name + ": Start cleaning");
			superagent.post("http://"+credentials+that.ip_address + "/api/clean").end(function(error, response) {
				if (error) {
					this.log("Could not send clean command to iLife Controller: %s", error.message);
					callback(error);
				} else {
					callback();
				}
			});
		} else {
			var that = this;

			if (!this.dock_on_stop){

				superagent.get("http://"+credentials+that.ip_address + "/api/status").end(function(error, response) {
					if (error) {
						that.log("Could not send request status of iLife Controller: %s", error.message);
						callback(error);
					} else {
						var tcObj = JSON.parse(response.text);

						if (tcObj.status.cleaning === "1"){
						    that.log(that.name + ": Cleaning, now stopping");
							superagent.post(that.ip_address + "/api/stop").end(function(error, response) {
								if (error) {
									that.log("Could not send clean command (to stop) to iLife Controller: %s", error.message);
									callback(error);
								} else {
									callback();
								}
							});
						}else{
							that.log(that.name + ": Not cleaning, doing nothing extra");
							callback();
						}
					}
				});
			}else {
				this.log(this.name + ": Start docking");
				superagent.post("http://"+credentials+that.ip_address + "/api/dock").end(function(error, response) {
					if (error) {
						this.log("Could not send clean command to iLife Controller: %s", error.message);
						callback(error);
					} else {
						callback();
					}
				});
			}
		}
	},

	getPowerState: function(callback) {
		var url = "http://"+credentials+that.ip_address + "/api/status";

		superagent.get(url).end(function(error, response) {
			if (error) {
				callback(error);
			} else {
				var tcObj = JSON.parse(response.text);

				callback(null, tcObj.status.cleaning === "1");
			}
		});
	},

	identify: function(callback) {
		this.log("Identify requested!");
		superagent.get("http://"+credentials+that.ip_address + "/api/info").end(function(error, response) {
			if (error) {
				this.log("Could not send command to iLife Controller: %s", error.message);
				callback(error);
			} else {
				callback();
			}
		});
	},

	getServices: function() {
		// the default values for things like serial number, model, etc.
		var that = this;
		var switchService = new Service.Switch(this.name);

		switchService.getCharacteristic(Characteristic.On).on('set', this.setPowerState.bind(this));
		switchService.getCharacteristic(Characteristic.On).on('get', this.getPowerState.bind(this));
		//setTimeout(function () {
		//	that.log("Hey");
		//		that.informationService.setCharacteristic(Characteristic.SerialNumber, "Hi there!");
		//}, 10)

		return [this.informationService, switchService];
	}
};
