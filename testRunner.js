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
var testRunner = require("./index.js");
var driver = new webdriver.Builder().withCapabilities(chromeCapabilities).build();
var inq = require("inquirer");

//============= LAUNCH BROWSER ===============
driver.get("http://evo.p2d.tech:8000/#/page/login");

const testSequencer = async function(){
	// await testRunner.demoTestingSequencer(driver);
	// await testRunner.loginTestingSequencer(driver);
	await testRunner.customerManagerTestingSequencer(driver);
}

testSequencer(); 