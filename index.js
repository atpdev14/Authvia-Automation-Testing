//============================================
//================ File Status ===============
//============================================


//============================================ 
//================ DEPENDENCIES ==============
//============================================
var webdriver = require('selenium-webdriver');
var firefox = require('selenium-webdriver/firefox');
var By = require("selenium-webdriver").By;
var Keys = require("selenium-webdriver").Key; 
var until = require("selenium-webdriver").until;
var chromeCapabilities = webdriver.Capabilities.chrome();
var chromeOptions = {'args': ['--test-type', '--incognito']};
chromeCapabilities.set('chromeOptions', chromeOptions);
// var driver = new webdriver.Builder().forBrowser('firefox').setFirefoxOptions().build();
var fs = require('fs');
var demoTesting = require("./modules/demoTestingModule.js");
var mpLoginTesting = require("./modules/loginTestingModule.js");
var mpManageCustomers = require("./modules/manageCustomersModule.js");
// var driver = new webdriver.Builder().withCapabilities(chromeCapabilities).build();
var inq = require("inquirer");
var exports = module.exports = {};

//============= LAUNCH BROWSER ===============
// driver.get("http://evo.p2d.tech:8000/#/page/login");

//============================================
//================ SCRIPT ====================
//============================================

var userInfo = {};

exports.getUserInfo = async function(){
	//========== Collect User Info ===============
	await inq.prompt([
		{
			type: 'input',
			name: 'name',
			message: "Please enter your name: ",
			default: "Tyler Proctor"
		},
		{
			type: 'input',
			name: 'email',
			message: "Please enter your email address: ",
			default: "tyler@authvia.com"
		},
		{
			type: 'input',
			name: 'password',
			message: "Please create a password: ",
			default: "buttercup"
		},
		{
			type: 'input',
			name: 'phoneNumber',
			message: "Please enter your phone number: ",
			default: "3086602288"
		}
	]).then(function(response){
		userInfo.name = response.name;
		userInfo.email = response.email;
		userInfo.password = response.password;
		userInfo.phoneNumber = response.phoneNumber;
		return userInfo;
	});
}


exports.demoTestingSequencer = async function(driver) {
	await exports.getUserInfo();
	await demoTesting.setDriver(driver, userInfo);
	await demoTesting.demoSequencer();
}


exports.loginTestingSequencer = async function(driver) {
	await exports.getUserInfo();
	await mpLoginTesting.setDriver(driver, userInfo);
	await mpLoginTesting.loginSequencer();
}

exports.customerManagerTestingSequencer = async function(driver) {
	await exports.getUserInfo();
	await mpManageCustomers.setDriver(driver, userInfo);
	await mpManageCustomers.manageCustomersSequencer();
}







 

 















