//============================================
//================ File Status ===============
//============================================
//Currently not returning to Manage Customers page after creating and payable fails.

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
var fs = require('fs');
var loginTestResultsPath = './testResultsFiles/loginTestResults.json';

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
	var loginTestResultsPath = "mpCustomerManagerTestingResults.json"; 
	var date = new Date();
	var myMerchantEmail = "tyler@authvia.com";
	var myEmail;
	var myName;
	var secondaryEmail = "tyler@pay2daysolutions.com";
	var myPassword;
	var myPhoneNumber;
	var secondaryPhoneNumber;
	var customersSidebarButton;
	var allActionButtons;
	var customersCreated = 0;

//================================================================================================
//								LOGIN SEQUENCER
//================================================================================================
exports.setDriver = function(launchBrowser, userInfo){
	driver = launchBrowser;
	myName = userInfo.name;
	myEmail = userInfo.email;
	myPhoneNumber = userInfo.phoneNumber;
	myPassword = userInfo.password;
}

exports.manageCustomersSequencer = async function() {
	await driver.sleep(7500);
	testResults["Date"] = date;

	await exports.loginAndContinue(myMerchantEmail, myPassword);
	await driver.sleep(5000);
	await exports.navigateToCustomersPage();
	await driver.sleep(5000);

	var customerIdFirst = await exports.generateCustomerId();

	await exports.createNewCustomer(customerIdFirst, "", myEmail, "Id and Email");
	await driver.sleep(5000);

	var customerIdSecond = await exports.generateCustomerId();

	await exports.createNewCustomer(customerIdSecond, myPhoneNumber, secondaryEmail, "Id, Phone, and Email");
	await driver.sleep(7500);

	var customerIdThird = await exports.generateCustomerId();
	await exports.createNewCustomer(customerIdThird, "", "", "Id Only");
	
	await driver.sleep(10000);
	await exports.deleteCustomerAccount(0);

	await exports.createPayable("150", "07/13/2018", "Should Pass");
	await driver.sleep(5000);
	await exports.createPayable("", "07/14/2018", "Should Fail");

	await exports.logResults();
}
//================================================================================================
//================================================================================================

exports.logResults = async function() {
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

exports.loginAndContinue = async function(username, password) {

	await driver.wait(until.elementLocated(By.css('[data-id = "mp-login-username-input"]')));

	usernameInput = await driver.findElement(By.css('[data-id = "mp-login-username-input"]'));
	passwordInput = await driver.findElement(By.css('[data-id = "mp-login-password-input"]'));
	signinButton = await driver.findElement(By.css('[data-id = "mp-login-signin-button"]'));

	await usernameInput.sendKeys(username);
	await passwordInput.sendKeys(password)
	await signinButton.click();
	await driver.wait(until.elementLocated(By.css('[data-id = "mp-sidebar-logout-button"]')));
}


exports.navigateToCustomersPage  = async function() {
	await driver.wait(until.elementLocated(By.css('[title="Customers"]')));
	customersSidebarButton = await driver.findElement(By.css('[title="Customers"]'));
	await customersSidebarButton.click();
}

exports.generateCustomerId = async function() {
	var customerId = "test";

	for(i=0; i < 5; i++){
		var randy = Math.floor(Math.random() * 9);
		customerId += randy;
	}

	return customerId;
}

exports.createNewCustomer = async function(id, phone, email, testName) {
	customersCreated++;	
	var createCustomerPlusButton;
	var customerIdInput;
	var customerPhoneInput;
	var customerEmailInput;
	var createCustomerFinalButton;
	var fullTestName = "Create Customer: " + testName;

	await driver.wait(until.elementLocated(By.css('[data-id="mp-customers-createCustomerPlus-button"]')));
	createCustomerPlusButton = await driver.findElement(By.css('[data-id="mp-customers-createCustomerPlus-button"]'));
	
	createCustomerPlusButton.click();
	await driver.sleep(5000);

	await driver.wait(until.elementLocated(By.css('[data-id="mp-createCustomer-customerId-input"]')));

	customerIdInput = await driver.findElement(By.css('[data-id="mp-createCustomer-customerId-input"]'));
	await customerIdInput.sendKeys(id);

	customerPhoneInput = await driver.findElement(By.css('[data-id="mp-createCustomer-customerPhone-input"]'));
	await customerPhoneInput.sendKeys(phone);

	customerEmailInput = await driver.findElement(By.css('[data-id="mp-createCustomer-customerEmail-input"]'));
	await customerEmailInput.sendKeys(email);

	await driver.sleep(5000);
	createCustomerFinalButton = await driver.findElement(By.css('[data-id="mp-createCustomer-createCustomer-button"]'));
	await createCustomerFinalButton.click();
	await driver.wait(until.elementLocated(By.css('[data-id="mp-customers-createCustomerPlus-button"]')));

	testResults[fullTestName] = await exports.countAccounts(customersCreated);
}

exports.countAccounts = async function(expectedAccounts) {
	await driver.wait(until.elementLocated(By.css('[data-id="mp-customersList-actions-menuButton"]')));
	await driver.sleep(5000);

	allActionButtons = await driver.findElements(By.css('[data-id="mp-customersList-actions-menuButton"]'));

	if(allActionButtons.length === expectedAccounts){
		return true;
	}else {
		return false;
	}
}

exports.deleteCustomerAccount = async function(deleteButtonIndex) {
	var deleteButton;
	var actionMenu;
	var confirmDeleteAccountButton;


	await driver.wait(until.elementLocated(By.css('[data-id="mp-manageCustomers-deleteAccount-actionButton"]')));
	actionMenu = await driver.findElements(By.css('[data-id="mp-customersList-actions-menuButton"]'));
	deleteButton = await driver.findElements(By.css('[data-id="mp-manageCustomers-deleteAccount-actionButton"]'));
	await actionMenu[deleteButtonIndex].click();
	await driver.sleep(5000);
	await deleteButton[deleteButtonIndex].click();
	await driver.sleep(5000);
	confirmDeleteAccountButton = await driver.findElement(By.css('[ng-click="confirm(1); deleteAccountOption(consumer.id)"]'));
	confirmDeleteAccountButton.click();
	customersCreated--;
	await driver.sleep(3000);

	testResults["Account Deleted"] = await exports.countAccounts(customersCreated);
}

exports.createPayable = async function(amountDue, dueDate, testName) {
	console.log();
	console.log("Create Payable function");

	var checkElementExists = await driver.findElements(By.css('[ng-model="value"]'));

	// console.log();
	// console.log("is this executing?");
	// console.log();

	var actionMenu;
	var createPayableButton;
	var payableTypeInput;
	var payableInputFields;
	var createInvoiceFinalSubmit;
	var payableId = exports.generateCustomerId();
	var key = "Payable " + testName;


	await driver.wait(until.elementLocated(By.css('[data-id="mp-manageCustomers-deleteAccount-actionButton"]')));
	actionMenu = await driver.findElements(By.css('[data-id="mp-customersList-actions-menuButton"]'));
	createPayableButton = await driver.findElements(By.css('[data-id="mp-manageCustomers-createInvoice-actionButton"]'));
	
	await actionMenu[0].click();
	await driver.sleep(3000);
	await createPayableButton[0].click();
	await driver.sleep(3000);

	payableTypeInput = await driver.findElement(By.css('[id="type"]'));
	payableInputFields = await driver.findElements(By.css('[ng-model="value"]'));
	createInvoiceFinalSubmit = await driver.findElement(By.css('[ng-click="invoiceCtrl.submitForm(false)"]'));
	await driver.sleep(1000);
	await payableInputFields[0].sendKeys(payableId);
	await driver.sleep(1000);
	await payableInputFields[1].sendKeys(amountDue);
	await driver.sleep(1000);
	await payableInputFields[2].sendKeys(dueDate);
	await driver.sleep(1000);

	await createInvoiceFinalSubmit.click();

	await driver.sleep(3000);
	
	checkElementExists = await driver.findElements(By.css('[ng-model="value"]'));

	if(checkElementExists.length === 0){
		console.log("Invoice Submit button clicked");
		testResults[key] = true;
	}else {
		testResults[key] = false;

		try{
			await actionMenu[0].click();
		}catch (error){
			console.log("Payable failed to create.");
		}
	}
}





































