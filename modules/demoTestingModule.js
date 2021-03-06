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
// var driver = new webdriver.Builder().withCapabilities(chromeCapabilities).build();
var driver = new webdriver.Builder().withCapabilities(chromeCapabilities);
// var driver = new webdriver.Builder().forBrowser('firefox').setFirefoxOptions().build();
var fs = require('fs');
var loginTestResultsPath = './testResultsFiles/loginTestResults.json';
var exports = module.exports = {};

//============================================
//================ SCRIPT ====================
//============================================
var demoButtonOnLogin;
var demoNameInput;
var emailAddressInput;
var demoButtonOnForm;
var elementNotFoundMessage = "Element could not be found";
var mpDemoLink;
var cpDemoLink;
var demoUsername; 
var mpUsernameLoginInput; 
var mpPasswordLoginInput; 
var mpDemoSignInButton;
var customersSidebarButton;
var shellAccountsList;
var testResults = {};
var deleteCustomerButton;
var demoTestResultsPath = './testResultsFiles/demoTestingResults.json';
var shellAccountActionButton;
var date = new Date();
var createDemoAccountButton;
var myName;
var myEmail;
var myPhoneNumber;
var myPassword;
var driver;

exports.setDriver = function(launchBrowser, userInfo){
	driver = launchBrowser;
	myName = userInfo.name;
	myEmail = userInfo.email;
	myPhoneNumber = userInfo.phoneNumber;
	myPassword = userInfo.password;
}

exports.demoSequencer = async function(){
	testResults["Date"] = date;
	await exports.openDemoForm();
	await exports.fillCreateDemoForm("DemoAutoTesting", myEmail);
	await exports.getDemoLinks(); 
	await exports.navigateNewLink(mpDemoLink);
	await exports.demoMpLogin();
	await exports.navigateToCustomersPage();
	await exports.countShellAccounts();
	// await exports.deleteCustomerAccount();
	await exports.navigateNewLink(cpDemoLink);
	await exports.registerDemoAccount();

	var stringifyResults = JSON.stringify(testResults, null, 2);
	var resultsString = "\n" + stringifyResults + "\n";

	fs.appendFile(demoTestResultsPath, resultsString, function(err){
		if(err){
			throw err;
		}else {
			console.log();
			console.log("Test Results Updated");
			console.log();
		}
	});
}

exports.openDemoForm = async function() {
	await driver.sleep(5000);
	demoButtonOnLogin = await driver.findElement(By.css('[data-id = "mp-login-createDemo-button"]'));
	demoButtonOnLogin.click();
}

exports.fillCreateDemoForm = async function(demoName, emailAddress) {
	demoUsername = emailAddress;
	await driver.wait(until.elementLocated(By.css('[data-id = "mp-demoPopUp-demoName-input"]')), 5000);

	demoNameInput = await driver.findElement(By.css('[data-id = "mp-demoPopUp-demoName-input"]'));
	emailAddressInput = await driver.findElement(By.css('[data-id = "mp-demoPopUp-email-input"]'));
	demoButtonOnForm = await driver.findElement(By.css('[data-id = "mp-demoPopUp-createDemo-button"]'));

	await demoNameInput.sendKeys(demoName);
	await emailAddressInput.sendKeys(emailAddress);
	await driver.sleep(1000);
	await demoButtonOnForm.click();
}

exports.getDemoLinks = async function() {
	await driver.wait(until.elementLocated(By.css('[data-id="mp-createDemo-merchantPortalDemo-link"]')), 5000);
	mpDemoLink = await driver.findElement(By.css('[data-id="mp-createDemo-merchantPortalDemo-link"]')).getAttribute('href');
	cpDemoLink = await driver.findElement(By.css('[data-id="mp-createDemo-consumerPortalDemo-link"]')).getAttribute('href');
	cpDemoLink += "#/login";

	console.log("cpDemoLink");
	console.log(cpDemoLink);

	if(mpDemoLink.length > 0){
		testResults["Demo Created"] = true;
	}else{
		testResults["Demo Created"] = false;
	}
}

exports.navigateNewLink = async function(url){
	await driver.sleep(2000);
	await driver.get(url);
	await driver.sleep(5000);
}

exports.demoMpLogin = async function() {
	await driver.wait(until.elementLocated(By.css('[name="account_email"]')));
	mpUsernameLoginInput = await driver.findElement(By.css('[name="account_email"]'));
	mpPasswordLoginInput = await driver.findElement(By.css('[name="account_password"]'));
	mpDemoSignInButton = await driver.findElement(By.css('[type="submit"]'));

	await mpUsernameLoginInput.sendKeys(demoUsername);
	await mpPasswordLoginInput.sendKeys("password");
	await driver.sleep(2000);

	mpDemoSignInButton.click()
}

exports.navigateToCustomersPage  = async function() {
	await driver.wait(until.elementLocated(By.css('[title="Customers"]')));

	var testLogin = await driver.findElements(By.css('[title="Customers"]'));
	if(testLogin.length > 0){
		testResults["Login Successful"] = true;
	}else {
		testResults["Login Successful"] = false;
	}
	
	customersSidebarButton = await driver.findElement(By.css('[title="Customers"]'));
	customersSidebarButton.click();
}

exports.countShellAccounts = async function() {
	await driver.wait(until.elementLocated(By.css('[data-title="consumersCtrl.customeridObj.label"]')));
	shellAccountsList = await driver.findElements(By.css('[data-title="consumersCtrl.customeridObj.label"]'));

	if(shellAccountsList.length === 5){
		testResults["Shell Accounts Created"] = true;
	}else if(shellAccountsList.length !== 5) {
		testResults["Shell Accounts Created"] = false;
	}
}


exports.createPayable = async function(payableId, payableType, amountDue, dueDate) {
	var createInvoiceButton;
	var payableIdInput;
	var amountDueInput;
	var dueDateInput;
	var payableTypeInput;

	await driver.wait(until.elementLocated(By.css('[data-title="consumersCtrl.customeridObj.label"]')));
	shellAccountsList = await driver.findElements(By.css('[data-title="consumersCtrl.customeridObj.label"]'));	
	shellAccountsList[0].click();
	await driver.wait(until.elementLocated(By.css('[ng-click="detailsCtrl.openInvoice(settings)"]')));
	createInvoiceButton = await driver.findElements(By.css('[ng-click="detailsCtrl.openInvoice(settings)"]'));
	createInvoiceButton.click();

	await driver.wait(until.elementLocated(By.css()));
	createInvoiceButton = await driver.findElements(By.css());	
	payableTypeInput = await driver.findElements(By.css());
	payableTypeInput.sendKeys(payableType);	
	payableIdInput = await driver.findElements(By.xpath());	
	amountDueInput = await driver.findElements(By.xpath());	
	dueDateInput = await driver.findElements(By.css());	


}


//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// ERROR! ERROR! ERROR! ERROR! == CAN'T LOCATE DELETE BUTTON == ERROR! ERROR! ERROR! ERROR! ERROR! ERROR! ERROR! ERROR! 
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//Write function to delete an account
exports.deleteCustomerAccount = async function() {
	shellAccountActionButton = await driver.findElement(By.xpath('//*[@id="menu1"]/span'));
	await shellAccountActionButton.click();
	await driver.sleep(5000);

	deleteCustomerButton = await driver.findElements(By.css('[ng-click="consumersCtrl.confirmDelete(consumer)"]'))
		.then((elements) => {
			// console.log();
			// console.log("Delete button elements: ");
			// console.log(elements);
		})
			.catch((error) => {
				console.log("Delete button could not be found.");
			});

	deleteCustomerButton[deleteCustomerButton.length - 1]
		.click()
		.catch((error) => {
			console.log("Nope.  Sorry, dude.");
		});

	// deleteCustomerButton.click()
	// 	.catch((error) => {
	// 		console.log("Can't click it, bruh.");
	// 	});

	await driver.wait(until.elementLocated(By.css('[data-title="consumersCtrl.customeridObj.label"]')));
	shellAccountsList = await driver.findElements(By.css('[data-title="consumersCtrl.customeridObj.label"]'));

	if(shellAccountsList.length === 4){
		testResults["Shell Accounts Deleted Successfully"] = true;
	}else if(shellAccountsList.length > 4) {
		testResults["Shell Accounts Deleted Successfully"] = false;
	}
}
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// ERROR! ERROR! ERROR! ERROR! ERROR! ERROR! ERROR! ERROR! ERROR! ERROR! ERROR! ERROR! ERROR! ERROR! ERROR! ERROR! 
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!


exports.registerDemoAccount = async function() {
	var registerAccountNumberFieldOne;
	var registerAccountNumberFieldTwo;
	var popUpSearchButton;
	var phoneNumberInputField;
	var passwordInputFieldOne;
	var confirmPasswordInputField;
	var accountEmailInputField;
	var checkTerms;
	var createAccountButton;
	var ccHolderName;
	var ccNumber;
	var ccExpireYear;
	var billingStreetAddress;
	var billingZipcode;
	var paymentInfoSubmitButton;

	await driver.wait(until.elementLocated(By.css('[ng-click="fn.createAccount()"]')));
	createDemoAccountButton = await driver.findElement(By.css('[ng-click="fn.createAccount()"]'));
	createDemoAccountButton.click();

	await driver.sleep(2000);
	registerAccountNumberFieldOne = await driver.findElement(By.css('[ng-model="modals.searchVal"]'));
	await registerAccountNumberFieldOne.sendKeys("10005");
	registerAccountNumberFieldTwo = await driver.findElement(By.css('[ng-model="modals.identifier"]'));
	popUpSearchButton = await driver.findElement(By.css('[ng-click="fn.searchAccount()"]'));
	await registerAccountNumberFieldTwo.sendKeys("10005");
	popUpSearchButton.click();
	await driver.sleep(5000);

	phoneNumberInputField = await driver.findElement(By.css('[type="tel"]'));
	phoneNumberInputField.sendKeys(myPhoneNumber);

	passwordInputFieldOne = await driver.findElement(By.css('[id="password"]'));
	passwordInputFieldOne.sendKeys("buttercup");

	confirmPasswordInputField = await driver.findElement(By.css('[id="confirmPassword"]'));
	confirmPasswordInputField.sendKeys("buttercup");

	accountEmailInputField = await driver.findElement(By.css('[placeholder="Email"]'));
	accountEmailInputField.sendKeys(myEmail);

	checkTerms = await driver.findElement(By.css('[class="fa fa-circle-o fa-2"]'));
	checkTerms.click();

	createAccountButton = await driver.findElement(By.css('[ng-click="fn.createAccount(modals.user)"]'));
	createAccountButton.click();

	//At this point the user must enter an authorization code.   May be able to use driver.wait(until()) to freeze the code while you manually enter an auth code.
	//Try using the wait command to check for an element that only exists when the user is logged in.


	// await driver.wait(until.elementLocated(By.css('[ng-model=“modals.card.holdername”]')), 2000000);
	//  ccHolderName = await driver.findElement(By.css('[ng-model="modals.card.holdername"]'));
	//  ccHolderName.sendKeys(myName);
	//  ccNumber = await driver.findElement(By.css('[ng-model="modals.card.number"]'));
	//  ccNumber.sendKeys("4111111111111111");
	//  ccExpireYear = await driver.findElement(By.css('[ng-model="modals.card.expiredYear"]'));
	//  ccExpireYear.sendKeys("2020");
	//  billingStreetAddress = await driver.findElement(By.css('[ng-model="modals.card.billingAddress"]'));
	//  billingAddress.sendKeys("105 W Holly El Segundo, CA");
	//  billingZipcode = await driver.findElement(By.css('[ng-model="modals.card.zipcode"]'));
	//  billingZipcode.sendKeys("90245");
	//  paymentInfoSubmitButton = await driver.findElement(By.css('[ng-click="fn.cardDetails()"]'));
	//  await driver.sleep(1000);
	//  paymentInfoSubmitButton.click();
}





















