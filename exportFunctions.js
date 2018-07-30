//============================================
//================ DEPENDENCIES ==============
//============================================

require('chromedriver');
var webdriver = require('selenium-webdriver');
var By = require("selenium-webdriver").By;
var until = require("selenium-webdriver").until;
var driver;
var fs = require('fs');
var exports = module.exports = {};


//============================================
//================ DECLARE FUNCTIONS =========
//============================================
	
	//Pass in webdriver to allow exported functions to access webdriver methods
	exports.setDriver = function(launchBrowswer) {
		 driver = launchBrowswer;
	}

	//Find an HTML element by Xpath and text value
	exports.findXpathWithText = function(a,b) {
		var elementPath = a;
		var elementText = b;
		var wholePath = `${elementPath}[text()='${elementText}']`;
		var element = driver.wait(
		until.elementLocated(By.xpath(wholePath)),
		20000);
		return element;
	}

	//Find an element by at data-attribute value
	exports.findByDataAttribute = function(dataValue) {
		var dataValue = dataValue;
		console.log("dataValue variable:");
		console.log(dataValue);
		var element = driver.findElement(By.css(`[data-element="${dataValue}"]`));
		return element;
	}


	//Find an element by at data-attribute value
	exports.findByAttribute = function(attribute, dataValue) {
		var dataValue = dataValue;
		var attribute = attribute;
		var element = driver.findElement(By.css(`[${attribute}="${dataValue}"]`));
		return element;
	}

	exports.findId = function(id){
		var element = driver.findElement(By.id(id));
		return element;
	}

	exports.logAsyncStatus = function(functionName) {
		if(functionName instanceof AsyncFunction){
			console.log("This is asynchronous.")
		} else {
			console.log("This is not asynchronous.")
		}
	}














