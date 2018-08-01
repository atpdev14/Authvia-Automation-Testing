//============================================
//================ File Status ===============
//============================================
//Functioning

//Date Last Modified- Monday July 9, 2018

// checkForChat() does not currently function as intended.  The chat icon appears in the DOM, but does not appear to have a valid xpath or an absolute xpath, most
// likely due to the fact that it is a third party script.  The code for the button lives in index.jade.  You may be able to add a unique identifier there to locate
// the element.


//============================================ 
//================ DEPENDENCIES ==============
//============================================

// require('chromedriver');
var webdriver = require('selenium-webdriver');
var firefox = require('selenium-webdriver/firefox');
var By = require("selenium-webdriver").By;
var Keys = require("selenium-webdriver").Key; 
var until = require("selenium-webdriver").until;
var chromeCapabilities = webdriver.Capabilities.chrome();
var chromeOptions = {'args': ['--test-type', '--incognito']};
chromeCapabilities.set('chromeOptions', chromeOptions);
var driver = new webdriver.Builder().withCapabilities(chromeCapabilities).build();
// var driver = new webdriver.Builder().forBrowser('firefox').setFirefoxOptions().build();
var fs = require('fs');
var locateElement = require("./exportFunctions.js");


//============= LAUNCH BROWSER ===============
locateElement.setDriver(driver);


//============================================
//================ SCRIPT ====================
//============================================
driver.get("http://evo.p2d.tech:8000/#/page/login");

	var usernameInput;
	var passwordInput;
	var signinButton;
	var logoutButton;
	var counter = 1;
	var tracker = {};
	var url;
	var testResults = {};
	var date = new Date();
	var myEmail = "tproctor4414@gmail.com";
	var myPhoneNumber = "3086602288";
	var customersSidebarButton;
	var loginTestResultsPath = './testResultsFiles/loginTestResults.json';

const loginSequencer = async function() {
	await driver.sleep(7500);

	testResults["Date"] = date;

	await elementsOnLoginPage();
	await checkFontColor('[data-id = "mp-login-signin-button"]');

	await sequencerInner("tyler@authvia.com", "buttercup", "Correct Login");
	await driver.wait(until.elementLocated(By.css('[data-id = "mp-login-username-input"]')));
	await clearFields();

	await sequencerInner("TYLER@AUTHVIA.COM", "buttercup", "Capitalized Username");
	await driver.wait(until.elementLocated(By.css('[data-id = "mp-login-username-input"]')));
	await clearFields();

	await sequencerInner("tproctor4414@gmail.com", "buttercup", "Wrong Username");
	await driver.wait(until.elementLocated(By.css('[data-id = "mp-login-username-input"]')));
	await clearFields();

	await sequencerInner("tyler@authvia.com", "ttercup", "Incorrect Password");
	await driver.wait(until.elementLocated(By.css('[data-id = "mp-login-username-input"]')));
	await clearFields();

	
	//Log results to loginTestResults.json
	var stringifyResults = JSON.stringify(testResults, null, 2);
	resultsString = "\n" + stringifyResults + "\n";

	fs.appendFile(loginTestResultsPath, resultsString, function(err){
		if(err){
			throw err;
		}else {
			console.log();
			console.log("Test Results Updated");
			console.log();
		}
	});
}


const sequencerInner = async function(username, password, testName) {
	var key = "Login Test- " + testName;
	testResults[key] = await login(username, password);
	await logout();
	return "done";
}


const login = async function(username, password) {
	console.log("Login " + counter + " running.");

	await driver.wait(until.elementLocated(By.css('[data-id = "mp-login-username-input"]')));

	usernameInput = await driver.findElement(By.css('[data-id = "mp-login-username-input"]'));
	passwordInput = await driver.findElement(By.css('[data-id = "mp-login-password-input"]'));
	signinButton = await driver.findElement(By.css('[data-id = "mp-login-signin-button"]'));

	await usernameInput.sendKeys(username);
	await passwordInput.sendKeys(password)
	await signinButton.click();

	var loginSuccess = await checkUrl("http://evo.p2d.tech:8000/#/app/report");
	counter++;
	console.log("loginSuccess: " + loginSuccess);
	console.log();
	return loginSuccess;
}

const  checkUrl = async function(correctUrl) {
	console.log("checkUrl")
	await driver.sleep(5000);
	
	var url = await driver.getCurrentUrl();
	 if(url === correctUrl){
	 	return true;
	 } else {
	 	return false;
	 }
	 // return tracker;
}

const logout = function() {
		driver.wait(until.elementLocated(By.css('[data-id = "mp-sidebar-logout-button"]')), 5000).then(function(){
				driver.findElement(By.css('[data-id = "mp-sidebar-logout-button"]')).click();
		}).catch(function(error){});
	return "done";
}

const clearFields = async function() {
	usernameInput = await driver.findElement(By.css('[data-id = "mp-login-username-input"]'));
	passwordInput = await driver.findElement(By.css('[data-id = "mp-login-password-input"]'));
	await usernameInput.clear();
	await passwordInput.clear();
}

const checkForElements = async function(selector, elementName) {
	var elementPresent;
	// await driver.sleep(5000);
	var logo = await driver.findElements(By.css(selector));
	
	if(logo.length === 0){
		elementPresent =  false;
	}else if (logo.length > 0 && logo.length < 2){
		elementPresent = true;
	}
	var key = elementName + " present?";
	testResults[key] = elementPresent; 
}

const elementsOnLoginPage = async function() {
	var logoPresent = await checkForElements('[data-id = "mp-login-merchantLogo-image"]', "Logo Image");
	var forgotButtonPresent = await checkForElements('[data-id = "mp-login-forgotPassword-button"]', "Forgot Password Button");
	var usernameInput = await checkForElements('[data-id = "mp-login-username-input"]', "Username Input");
	var passwordInput = await checkForElements('[data-id = "mp-login-password-input"]', "Password Input");
	//Currently can't find Chat Icon by Xpath.
	// await checkForChat();

	testResults.logoPresent = logoPresent;
	testResults.forgotButtonPresent = forgotButtonPresent;
	testResults.usernameInput = usernameInput;
	testResults.passwordInput = passwordInput;
}

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//!!!!!!!!!!!!!  Returned false on first test when icon was visible.  May be timing issue, may be faulty code.
const checkForChat = async function(){
	await driver.sleep(20000);
	var chatIconPresent = await driver.findElements(By.xpath('//*[@id="intercom-container"]/div/div[2]/svg'));
	console.log(chatIconPresent);
	
	if(chatIconPresent.length === 0){
		testResults["Chat Icon Present"] = false;
	}else if (chatIconPresent.length > 0 && chatIconPresent.length < 2){
		testResults["Chat Icon Present"] = true;
	}
}

const checkFontColor = async function(selector) {
	var element = await driver.findElement(By.css(selector));

	var elementText = await element.getText();
	
	var elementColor = await element.getCssValue('color');
	testResults["Element Text"] = elementText;
	testResults["Element Color"] = elementColor;
}



loginSequencer();




































