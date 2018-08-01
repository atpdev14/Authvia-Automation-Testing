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
var fs = require('fs');
var inq = require("inquirer");
var exports = module.exports = {};

//============================================
//================ SCRIPT ====================
//============================================
	var usernameInput;
	var passwordInput;
	var signinButton;
	var logoutButton;
	var counter = 1;
	var tracker = {};
	var url;
	var testResults = {};
	var date = new Date();
	var myName;
	var myEmail;
	var myPassword;
	var myPhoneNumber;
	var usernameLogin;
	var passwordLogin;
	var customersSidebarButton;
	var loginTestResultsPath = './testResultsFiles/loginTestResults.json';
	var driver;

exports.getCredentials = function(){
	inq.prompt([
		{
			type: 'input',
			name: 'username',
			password: 'Enter your username: '
		},
		{
			type: 'input',
			name: 'password',
			message: 'Please enter your password: '
		}
	]).then(function(response){
		usernameLogin = response.username;
		passwordLogin = response.password;
		return true;
	});
}

exports.setDriver = function(launchBrowser, userInfo){
	driver = launchBrowser;
	myName = userInfo.name;
	myEmail = userInfo.email;
	myPhoneNumber = userInfo.phoneNumber;
	myPassword = userInfo.password;
}

exports.loginSequencer = async function() {
	await exports.getCredentials();
	await driver.sleep(7500);

	testResults["Date"] = date;

	await exports.elementsOnLoginPage();
	await exports.checkFontColor('[data-id = "mp-login-signin-button"]');

	await exports.sequencerInner(usernameLogin, passwordLogin, "Correct Login");
	await driver.wait(until.elementLocated(By.css('[data-id = "mp-login-username-input"]')));
	await exports.clearFields();

	await exports.sequencerInner(usernameLogin.toUpperCase(), passwordLogin, "Capitalized Username");
	await driver.wait(until.elementLocated(By.css('[data-id = "mp-login-username-input"]')));
	await exports.clearFields();

	await exports.sequencerInner(usernameLogin.substring(1,5), passwordLogin, "Wrong Username");
	await driver.wait(until.elementLocated(By.css('[data-id = "mp-login-username-input"]')));
	await exports.clearFields();

	await exports.sequencerInner(usernameLogin, passwordLogin.substring(1,5), "Incorrect Password");
	await driver.wait(until.elementLocated(By.css('[data-id = "mp-login-username-input"]')));
	await exports.clearFields();

	
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


exports.sequencerInner = async function(username, password, testName) {
	var key = "Login Test- " + testName;
	testResults[key] = await exports.login(username, password);
	await exports.logout();
	return "done";
}


exports.login = async function(username, password) {
	console.log("Login " + counter + " running.");

	await driver.wait(until.elementLocated(By.css('[data-id = "mp-login-username-input"]')));

	usernameInput = await driver.findElement(By.css('[data-id = "mp-login-username-input"]'));
	passwordInput = await driver.findElement(By.css('[data-id = "mp-login-password-input"]'));
	signinButton = await driver.findElement(By.css('[data-id = "mp-login-signin-button"]'));

	await usernameInput.sendKeys(username);
	await passwordInput.sendKeys(password)
	await signinButton.click();

	var loginSuccess = await exports.checkUrl("http://evo.p2d.tech:8000/#/app/report");
	counter++;
	console.log("loginSuccess: " + loginSuccess);
	console.log();
	return loginSuccess;
}

exports.checkUrl = async function(correctUrl) {
	console.log("checkUrl")
	await driver.sleep(5000);
	
	var url = await driver.getCurrentUrl();
	 if(url === correctUrl){
	 	return true;
	 } else {
	 	return false;
	 }
}

exports.logout = function() {
		driver.wait(until.elementLocated(By.css('[data-id = "mp-sidebar-logout-button"]')), 5000).then(function(){
				driver.findElement(By.css('[data-id = "mp-sidebar-logout-button"]')).click();
		}).catch(function(error){});
	return "done";
}

exports.clearFields = async function() {
	usernameInput = await driver.findElement(By.css('[data-id = "mp-login-username-input"]'));
	passwordInput = await driver.findElement(By.css('[data-id = "mp-login-password-input"]'));
	await usernameInput.clear();
	await passwordInput.clear();
}

exports.checkForElements = async function(selector, elementName) {
	var elementPresent;
	var logo = await driver.findElements(By.css(selector));
	
	if(logo.length === 0){
		elementPresent =  false;
	}else if (logo.length > 0 && logo.length < 2){
		elementPresent = true;
	}
	var key = elementName + " present?";
	testResults[key] = elementPresent; 
}

exports.elementsOnLoginPage = async function() {
	var logoPresent = await exports.checkForElements('[data-id = "mp-login-merchantLogo-image"]', "Logo Image");
	var forgotButtonPresent = await exports.checkForElements('[data-id = "mp-login-forgotPassword-button"]', "Forgot Password Button");
	var usernameInput = await exports.checkForElements('[data-id = "mp-login-username-input"]', "Username Input");
	var passwordInput = await exports.checkForElements('[data-id = "mp-login-password-input"]', "Password Input");

	testResults.logoPresent = logoPresent;
	testResults.forgotButtonPresent = forgotButtonPresent;
	testResults.usernameInput = usernameInput;
	testResults.passwordInput = passwordInput;
}

exports.checkForChat = async function(){
	await driver.sleep(20000);
	var chatIconPresent = await driver.findElements(By.xpath('//*[@id="intercom-container"]/div/div[2]/svg'));
	console.log(chatIconPresent);
	
	if(chatIconPresent.length === 0){
		testResults["Chat Icon Present"] = false;
	}else if (chatIconPresent.length > 0 && chatIconPresent.length < 2){
		testResults["Chat Icon Present"] = true;
	}
}

exports.checkFontColor = async function(selector) {
	var element = await driver.findElement(By.css(selector));

	var elementText = await element.getText();
	
	var elementColor = await element.getCssValue('color');
	testResults["Element Text"] = elementText;
	testResults["Element Color"] = elementColor;
}





































