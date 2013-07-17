//===========================================================================
// FILE: test.js
//
// DESCRIPTION:
//    unit tests
//
// HISTORY:
//    Created: 3/26/13 Chad Scharf
//===========================================================================
/**
 * Unit tests
 * //TODO: Implement assert statements and get a more complete set of use cases for unit tests outside of happy path
 *
 * @name test
 */

var nbalanced = require("./../lib/nbalanced");
var assert = require('assert');

// ******************************************************************************************
// ******************************************************************************************
// WARNING: This will create a lot of "stuff" in your account, so only use a test marketplace
//   This will automatically create a new test account if one is not specified
// ******************************************************************************************
// ******************************************************************************************
var config = {
    // marketplace_uri: "/v1/marketplaces/:marketplace-id", // test marketplace
    // secret: ":secret" // test secret
};

function series(callbacks, last) {
    var results = [];
    function next() {
        try {
            var callback = callbacks.shift();
            if(callback) {
                callback(function() {
                    results.push(Array.prototype.slice.call(arguments));
                    next();
                });
            } else {
                last(results);
            }
        }
        catch (e){
            console.error(e);
            last(results);
        }
    }
    next();
}

var api;

var myCard;
var myBankAccount;
var myVerification;
var myHold;
var myDebit;
var myRefund;
var myCredit;
var myAccount;
var myAccountBankAccount;
var myCustomer;
var myAccountCard;
var myReversal;
var myEvent;

// Start our asynchronous dependency execution test chain
series([
    // ***********************************************************
    // Create test market place
    // ***********************************************************
    function (next) {
	if(config.marketplace_uri && config.secret) {
	    api = new nbalanced(config);
	    next("Load test market");
	}else{
	    console.log("Creating new marketplace");
	    nbalanced.MakeTestMarket(function(err, conf) {
		config = conf;
		api = new nbalanced(config);
		console.log("Marketplace created", config.marketplace_uri, "secret:", config.secret);
		next("Created test market");
	    });
	}
    },


    // ***********************************************************
    // Cards
    // ***********************************************************
    function (next) {
        api.Cards.create({
            card_number: "5105105105105100",
            expiration_year: 2020,
            expiration_month: 12,
            security_code: "123"
        }, function (err, object) {
            if (err) {
                console.error("api.Cards.create", err);
                throw err;
            }
            myCard = object;
            console.log("Created new Card:", myCard.uri);
            next("api.Cards.create");
        });
    },
    function (next) {
        api.Cards.update(myCard.uri, {
            meta: {
                test: "my card test update metadata"
            }
        }, function (err, object) {
            if (err) {
                console.error("api.Cards.update", err);
                throw err;
            }
            myCard = object;
            console.log("Updated Card:", myCard.uri);
            next("api.Cards.update");
        });
    },
    function (next) {
        api.Cards.get(myCard.uri, function (err, object) {
            if (err) {
                console.error("api.Cards.get", err);
                throw err;
            }
            myCard = object;
            console.log("Retrieved Card:", myCard.uri);
            next("api.Cards.get");
        });
    },
    function (next) {
        api.Cards.list({
            limit: 20,
            offset: 0
        }, function (err, object) {
            if (err) {
                console.error("api.Cards.list", err);
                throw err;
            }
            console.log("List Cards:", object.total, "total");
            next("api.Cards.list");
        });
    },
    function (next) {
        api.Cards.invalidate(myCard.uri, function (err, object) {
            if (err) {
                console.error("api.Cards.invalidate", err);
                throw err;
            }
            myCard = object;
            console.log("Invalidated Card:", myCard.uri);
            next("api.Cards.invalidate");
        });
    },
    function (next) {
        api.Cards.create({
            card_number: "4111111111111111",
            expiration_year: 2018,
            expiration_month: 6,
            security_code: "456",
            name: "Stacey Ferrari"
        }, function (err, object) {
            if (err) {
                console.error("api.Cards.create2", err);
                throw err;
            }
            myCard = object;
            console.log("Created another Card:", myCard.uri);
            next("api.Cards.create2");
        });
    },




    // ***********************************************************
    // Bank Accounts
    // ***********************************************************
    function (next) {
        api.BankAccounts.create({
            name: "Miranda Benz",
            account_number: "9900826301",
            routing_number: "121000359",
            type: "checking",
            meta: {
                info: "created another test account",
                test: true
            }
        }, function (err, object) {
            if (err) {
                console.error("api.BankAccounts.create2", err);
                throw err;
            }
            myBankAccount = object;
            console.log("Created new Bank Account:", myBankAccount.uri);
            next("api.BankAccounts.create2");
        });
    },
    function (next) {
        api.BankAccounts.delete(myBankAccount.uri, function (err) {
            if (err) {
                console.error("api.BankAccounts.delete", err);
                throw err;
            }
            console.log("Deleted Bank Account:", myBankAccount.uri);
            next("api.BankAccounts.delete");
        });
    },
    function (next) {
        api.BankAccounts.create({
            name: "Jessica Maserati",
            account_number: "9900000001",
            routing_number: "121000358",
            type: "checking",
            meta: {
                info: "this is a test account",
                test: true
            }
        }, function (err, object) {
            if (err) {
                console.error("api.BankAccounts.create", err);
                throw err;
            }
            myBankAccount = object;
            console.log("Created new Bank Account:", myBankAccount.uri);
            next("api.BankAccounts.create");
        });
    },
    function (next) {
        api.BankAccounts.update(myBankAccount.uri, {
            meta: {
                additional_info: "All your bank are belong to us!",
                info: "I've been updated!"
            }
        }, function (err, object) {
            if (err) {
                console.error("api.BankAccounts.update", err);
                throw err;
            }
            myBankAccount = object;
            if (myBankAccount.meta.info == "I've been updated!") {
                console.log("Updated Bank Account:", myBankAccount.uri);
            } else {
                console.log("Updated Bank Account:", "[FAILED]", myBankAccount.uri);
            }
            next("api.BankAccounts.update");
        });
    },
    function (next) {
        api.BankAccounts.get(myBankAccount.uri, function (err, object) {
            if (err) {
                console.error("api.BankAccounts.get", err);
                throw err;
            }
            myBankAccount = object;
            console.log("Retrieved Bank Account:", myBankAccount.uri);
            next("api.BankAccounts.get");
        });
    },
    function (next) {
        api.BankAccounts.list(function (err, object) {
            if (err) {
                console.error("api.BankAccounts.list", err);
                throw err;
            }
            console.log("List Bank Accounts:", object.total, "total");
            next("api.BankAccounts.list");
        });
    },
    function (next) {
        api.BankAccounts.verify(myBankAccount.verifications_uri, function (err, object) {
            if (err) {
                console.error("api.BankAccounts.verify", myBankAccount.verifications_uri, " >> ", JSON.stringify(err));
                throw err;
            }
            myVerification = object;
            console.log("Verify Bank Account", myVerification.uri);
            next("api.BankAccounts.verify");
        });
    },
    function (next) {
        api.BankAccounts.verification(myVerification.uri, function (err, object) {
            if (err) {
                console.error("api.BankAccounts.verification", err);
                throw err;
            }
            myVerification = object;
            console.log("Retrieved Verification", myVerification.uri);
            next("api.BankAccounts.verification");
        });
    },
    function (next) {
        api.BankAccounts.verifications(myBankAccount.verifications_uri, {}, function (err, object) {
            if (err) {
                console.error("api.BankAccounts.verifications", err);
                throw err;
            }
            console.log("List Verifications:", object.total, "total");
            next("api.BankAccounts.verifications");
        });
    },
    function (next) {
        api.BankAccounts.confirm(myVerification.uri, 6, 2, function (err) {
            if (err) {
                console.log("Confirm:", err.description);
                next("api.BankAccounts.confirm.fail");
            } else {
                console.log("Confirm did not fail as expected");
                next("api.BankAccounts.confirm.fail");
            }
        });
    },
    function (next) {
        api.BankAccounts.confirm(myVerification.uri, 1, 1, function (err, object) {
            if (err) {
                console.error("api.BankAccounts.confirm", err);
                throw err;
            }
            console.log("Confirm:", object.uri);
            next("api.BankAccounts.confirm");
        });
    },





    // ***********************************************************
    // Customers
    // ***********************************************************
    function (next) {
        api.Customers.create({
            name: "Philosorapter 9000",
            email: "philosorapter@example.com",
            meta: {
                "customKey.first": "first",
                "customKey.second": "second"
            },
            ssn_last4: "1234",
            business_name: "Internet Memes LLC",
            address: {
                line1: "123 Main St",
                line2: "Apt. 1",
                city: "San Francisco",
                state: "CA",
                postal_code: "94133",
                country_code: "USA"
            },
            phone: "+19994445555",
            dob: "1984-01",
            ein: "451111111"
            //, facebook: ""
            //, twitter: ""
        },function (err, object) {
            if(err){
                console.error("api.Customers.create", err);
                throw err;
            }
            myCustomer = object;
            // console.log(myCustomer);
            console.log("Created new Customer:", myCustomer.uri);
            next("api.Customers.create");
        });
    },
    function (next) {
        api.Customers.get(myCustomer.uri, function (err, object) {
            if (err) {
                console.error("api.Customers.get", err);
                throw err;
            }
            myCustomer = object;
            console.log("Retrieved Customer:", myCustomer.uri);
            next("api.Customers.get");
        });
    },
    function (next) {
        api.Customers.update(myCustomer.uri, {
            name: "updated customer name",
            meta: {
                test: true
            },
            "illegal-property": "This should not be saved"
        }, function (err, object) {
            if (err) {
                console.error("api.Customers.update", err);
                throw err;
            }
            myCustomer = object;
            // console.log(myCustomer);
            if (myCustomer.name != "updated customer name"
                || myCustomer.meta.test != "True") {
                var err = new Error("API responded but customer information was not updated");
                console.error("api.Customers.update", err);
                throw err;
            }
            console.log("Updated Customer:", myCustomer.uri);
            next("api.Customers.update");
        });
    },
    function (next) {
        api.Customers.list(function (err, object) {
            if (err) {
                console.error("api.Customers.list", err);
                throw err;
            }
            console.log("List Customers:", object.total, "total");
            next("api.Customer.list");
        });
    },
    function (next) {
        api.Customers.addCard(myCustomer.uri, myCard.uri, function (err, object) {
            if (err) {
                console.error("api.Customers.addCard", err);
                throw err;
            }
            myCustomer = object;
            console.log("Added Card to Customer:", myCustomer.uri);
            next("api.Customers.addCard");
        });
    },
    function (next) {
        api.Customers.getCards(myCustomer.uri, function(err, object) {
            if (err) {
                console.error("api.Customers.getCards", err);
                throw err;
            }

            console.log("Fetched Cards for Customer:", object.items.length, "total");
            next("api.Customer.getCards");
        });
    },
    function (next) {
        api.BankAccounts.create({
            name: "Customer Bank Account",
            account_number: "9900000002",
            routing_number: "121000000",
            type: "checking"
        }, function (err, object) {
            if (err) {
                console.error("api.BankAccounts.create3", err);
                throw err;
            }
            myAccountBankAccount = object;
            console.log("Created new Bank Account to test Customer.addBankAccount:", myAccountBankAccount.uri);
            next("api.BankAccounts.create3");
        });
    },
    function (next) {
        api.Customers.addBankAccount(myCustomer.uri, myAccountBankAccount.uri, function (err, object) {
            if (err) {
                console.error("api.Customers.addBankAccount", err);
                throw err;
            }
            // myAccount = object;
            console.log("Added Bank Account to Customer:", myCustomer.uri);
            next("api.Customers.addBankAccount");
        });
    },
    function (next) {
        api.Customers.getBankAccounts(myCustomer.uri, function(err, object) {
            if (err) {
                console.error("api.Customers.getBankAccounts", err);
                throw err;
            }

            console.log("Fetched Bank Accounts for Customer:", object.items.length, "total");
            next("api.Customer.getBankAccounts");
        });
    },
    //
    // test the Customers api scoped to a particular customer
    //
    function (next) {
        api = api.Customers.nbalanced(myCustomer);
        api.Customers.update({
            name: "second customer name update"
        }, function (err, object) {
            if (err) {
                console.error("api.Customers.update scoped", err);
                throw err;
            }
            myCustomer = object;
            // console.log(myCustomer);
            if (myCustomer.name != "second customer name update") {
                var err = new Error("API responded but customer information was not updated");
                console.error("api.Customers.update scoped", err);
                throw err;
            }
            console.log("Updated Scoped Customer:", myCustomer.uri);
            next("api.Customers.update scoped");
        });
    },
    function (next) {
        api.Customers.get(function (err, object) {
            if (err) {
                console.error("api.Customers.get scoped", err);
                throw err;
            }
            myCustomer = object;
            console.log("Retrieved Scoped Customer:", myCustomer.uri);
            next("api.Customers.get scoped");
        });
    },
    function (next) {
        // create a new card to test scoped customer
        api = new nbalanced(config);
        api.Cards.create({
            card_number: "4444444444444448",
            expiration_year: 2018,
            expiration_month: 2,
            security_code: "123",
            name: "Lacey Ferrari"
        }, function (err, object) {
            if (err) {
                console.error("api.Cards.create scoped", err);
                throw err;
            }
            myCard = object;
            console.log("Created yet another Card to test scoped Customer.addCard:", myCard.uri);
            next("api.Cards.create scoped");
        });
    },
    function (next) {
        // create a new bank account to test scoped customer
        api.BankAccounts.create({
            name: "Scoped Customer Bank Account",
            account_number: "9900000003",
            routing_number: "121000000",
            type: "checking"
        }, function (err, object) {
            if (err) {
                console.error("api.BankAccounts.create scoped", err);
                throw err;
            }
            myAccountBankAccount = object;
            console.log("Created new Bank Account to test scoped Customer.addBankAccount:", myAccountBankAccount.uri);
            next("api.BankAccounts.create scoped");
        });
    },
    function (next) {
        api = api.Customers.nbalanced(myCustomer);
        api.Customers.addCard(myCard.uri, function (err, object) {
            if (err) {
                console.error("api.Customers.addCard scoped", err);
                throw err;
            }
            myCustomer = object;
            console.log("Added Card to Scoped Customer:", myCustomer.uri);
            next("api.Customers.addCard scoped");
        });
    },
    function (next) {
        api.Customers.addBankAccount(myAccountBankAccount.uri, function (err, object) {
            if (err) {
                console.error("api.Customers.addBankAccount scoped", err);
                throw err;
            }
            // myAccount = object;
            console.log("Added Bank Account to Scoped Customer:", myCustomer.uri);
            next("api.Customers.addBankAccount scoped");
        });
    },
    function (next) {
        api.Customers.destroy(myCustomer.uri, function (err, object) {
            if (err) {
                console.error("api.Customers.destroy", err);
                throw err;
            }
            console.log("Destroyed Customer:", myCustomer.uri);
            myCustomer = null;
            next("api.Customers.destroy");
        });
    },

    // test debiting a scoped customer
    function (next) {
	api = new nbalanced(config);
	api.Customers.create({}, function(err, object) {
	    if (err) {
                console.error("api.Customers.create", err);
                throw err;
            }
	    myCustomer = object;
            console.log("Created second Customer:", myCustomer.uri);
	    next("api.Customers.create");
	});
    },

    function (next) {
        // create a new card to test scoped customer
        api.Cards.create({
            card_number: "4111111111111111",
            expiration_year: 2018,
            expiration_month: 2,
            security_code: "123",
            name: "Joe Ferrari"
        }, function (err, object) {
            if (err) {
                console.error("api.Cards.create", err);
                throw err;
            }
            myCard = object;
            console.log("Created yet another Card to test scoped Customer.addCard:", myCard.uri);
            next("api.Cards.create scoped");
        });
    },
    function (next) {
	api = api.Customers.nbalanced(myCustomer);
	api.Customers.addCard(myCard.uri, function (err, object) {
	    if (err) {
                console.error("api.Customers.addCard scoped", err);
                throw err;
            }
            myCustomer = object;
            console.log("Added Card to Scoped Customer:", myCustomer.uri);
            next("api.Customers.addCard scoped");
	});
    },
    function (next) {
	api.Debits.create({ amount: 5000 }, function(err, object) {
	    if (err) {
                console.error("api.Debits.create scoped", err);
                throw err;
            }
	    console.log("Debited Card to Scoped Customer", myCustomer.uri);
	    next("api.Debits.create scoped");
	});
    },



    // ***********************************************************
    // Accounts
    // ***********************************************************
    function(next) {
        api = new nbalanced(config);
        api.Accounts.create(function (err, object) {
            if (err) {
                console.error("api.Accounts.create", err);
                throw err;
            }
            myAccount = object;
            console.log("Created new Account:", myAccount.uri);
            // Create a new instance of our api client with our new account info
            api = api.Accounts.nbalanced(myAccount);
            next("api.Accounts.create");
        });
    },
    function(next) {
        var previousAccountUri = api.Accounts._account_uri;
        api.Accounts.underwrite({
            type: "business",
            name: "Nikki's Porsche",
            phone_number: "+12025874411",
            tax_id: "215263254",
            postal_code: "90210",
            street_address: "123 Rodeo Drive",
            country_code: "USA",
            person: {
                name: "Chosimba One",
                dob: "1984-01-01",
                postal_code: "90210",
                street_address: "123 Rodeo Drive",
                country_code: "USA"
            }
        }, function (err, object) {
            if (err) {
                console.error("api.Accounts.underwrite", "business", err);
                throw err;
            }
            myAccount = object;
            if (previousAccountUri != myAccount.uri){
                err = new Error("Error underwriting existing account, it created a new account");
                console.error("api.Accounts.underwrite", "business", err);
                throw err;
            }
            console.log("Underwrite Existing Account with Business:", myAccount.uri);
            next("api.Accounts.underwrite.business");
        });
    },
    function(next) {
        // reset to use a fresh account
        api = new nbalanced(config);
        api.Accounts.underwrite({
            type: "business",
            name: "Nikki's Porsche",
            phone_number: "+12025874411",
            tax_id: "215263254",
            postal_code: "90210",
            street_address: "123 Rodeo Drive",
            country_code: "USA",
            person: {
                name: "Chosimba One",
                dob: "1984-01-01",
                postal_code: "90210",
                street_address: "123 Rodeo Drive",
                country_code: "USA"
            }
        }, function (err, object) {
            if (err) {
                console.error("api.Accounts.underwrite", "business", err);
                throw err;
            }
            myAccount = object;
            console.log("Underwrite New Account With Business:", myAccount.uri);
            next("api.Accounts.underwrite.business");
        });
    },
    function(next) {
        api.Accounts.underwrite({
            type: "person",
            name: "Tabitha Royce",
            phone_number: "+15023335555",
            dob: "1981-12-01",
            postal_code: "90210",
            street_address: "123 Rodeo Drive",
            country_code: "USA"
        }, function (err, object) {
            if (err) {
                console.error("api.Accounts.underwrite", "person", err);
                throw err;
            }
            myAccount = object;
            // Create a new instance of our api client with our new account info
            api = api.Accounts.nbalanced(myAccount);
            console.log("Underwrite New Account With Person:", myAccount.uri);
            next("api.Accounts.underwrite.person");
        });
    },
    function (next) {
        api.Accounts.get(myAccount.uri, function (err, object) {
            if (err) {
                console.error("api.Accounts.get", err);
                throw err;
            }
            myAccount = object;
            console.log("Retrieved Account:", myAccount.uri);
            next("api.Accounts.get");
        });
    },
    function (next) {
        api.Accounts.list(function (err, object) {
            if (err) {
                console.error("api.Accounts.list", err);
                throw err;
            }
            console.log("List Accounts:", object.total, "total");
            next("api.Accounts.list");
        });
    },
    function (next) {
        api.Accounts.update(myAccount.uri, {
            description: "updated account description",
            meta: {
                test: true
            },
            "illegal-property": "This should not be saved"
        }, function (err, object) {
            if (err) {
                console.error("api.Accounts.update", err);
                throw err;
            }
            myAccount = object;
            console.log("Updated Account:", myAccount.uri);
            next("api.Accounts.update");
        });
    },
    function (next) {
        // create a new card to test Accounts.addCard
        api = new nbalanced(config);
        api.Cards.create({
            card_number: "341111111111111",
            expiration_year: 2020,
            expiration_month: 9,
            security_code: "1234",
            name: "Casey Ferrari"
        }, function (err, object) {
            if (err) {
                console.error("api.Cards.create for Accounts.addCard", err);
                throw err;
            }
            myAccountCard = object;
            console.log("Created yet another Card to test Accounts.addCard:", myAccountCard.uri);
            next("api.Cards.create for Accounts.addCard");
        });
    },
    function (next) {
        api.Accounts.addCard(myAccount.uri, myAccountCard.uri, function (err, object) {
            if (err) {
                console.error("api.Accounts.addCard", err);
                throw err;
            }
            myAccount = object;
            console.log("Added Card to Account:", myAccount.uri);
            next("api.Accounts.addCard");
        });
    },
    /*
    function (next) {
        api.Accounts.addBankAccount(myAccount.uri, myBankAccount.uri, function (err, object) {
            if (err) {
                console.error("api.Accounts.addBankAccount", err);
                throw err;
            }
            myAccount = object;
            console.log("Added Bank Account to Account:", myAccount.uri);
            next("api.Accounts.addBankAccount");
        });
    },
    */
    function (next) {
        api = api.Accounts.nbalanced(myAccount);
        api.BankAccounts.create({
            name: "Veronica Lamborghini",
            account_number: "9900000001",
            routing_number: "121000358",
            type: "checking"
        }, function (err, object) {
            if (err) {
                console.error("api.BankAccounts.create4", err);
                throw err;
            }
            myAccountBankAccount = object;
            console.log("Created new Bank Account:", myAccountBankAccount.uri);
            next("api.BankAccounts.create3");
        });
    },
    function (next) {
        api.BankAccounts.verify(myAccountBankAccount.verifications_uri, function (err, object) {
            if (err) {
                console.error("api.BankAccounts.verify2", myAccountBankAccount.verifications_uri, " >> ", JSON.stringify(err));
                throw err;
            }
            myVerification = object;
            console.log("Verify Bank Account", myVerification.uri);
            next("api.BankAccounts.verify2");
        });
    },
    function (next) {
        api.BankAccounts.confirm(myVerification.uri, 1, 1, function (err, object) {
            if (err) {
                console.error("api.BankAccounts.confirm2", err);
                throw err;
            }
            console.log("Confirm:", object.uri);
            next("api.BankAccounts.confirm2");
        });
    },






    // ***********************************************************
    // Holds
    // ***********************************************************
    function (next) {
        api.Holds.create({
            amount: 10000,
            appears_on_statement_as: "HOLDS-R-US",
            source_uri: myAccountCard.uri
        }, function (err, object) {
            if (err) {
                console.error("api.Holds.create", err);
                throw err;
            }
            myHold = object;
            console.log("Created Hold:", myHold.uri);
            next("api.Holds.create");

        });
    },
    function (next) {
        api.Holds.get(myHold.uri, function (err, object) {
            if (err) {
                console.error("api.Holds.get", err);
                throw err;
            }
            myHold = object;
            console.log("Retrieved Hold:", myHold.uri);
            next("api.Holds.get");
        });
    },
    function (next) {
        api.Holds.list(function (err, object) {
            if (err) {
                console.error("api.Holds.list", err);
                throw err;
            }
            console.log("List Holds:", object.total, "total");
            next("api.Holds.list");
        });
    },
    function (next) {
        api.Holds.update(myHold.uri, {
            description: "updated hold description",
            meta: {
                test: true
            },
            "illegal-property": "This should not be saved"
        }, function (err, object) {
            if (err) {
                console.error("api.Holds.update", err);
                throw err;
            }
            myHold = object;
            console.log("Updated Hold:", myHold.uri);
            next("api.Holds.update");
        });
    },
    function (next) {
        api.Holds.void(myHold.uri, function (err) {
            if (err) {
                console.error("api.Holds.void", err);
                throw err;
            }
            console.log("Void Hold:", myHold.uri);
            next("api.Holds.void");
        });
    },
    function (next) {
        api.Holds.create({
            amount: 10000,
            appears_on_statement_as: "HOLDS-R-US2",
            source_uri: myAccountCard.uri
        }, function (err, object) {
            if (err) {
                console.error("api.Holds.create2", err);
                throw err;
            }
            myHold = object;
            console.log("Created Hold:", myHold.uri);
            next("api.Holds.create2");

        });
    },






    // ***********************************************************
    // Debits
    // ***********************************************************
    function (next) {
        api = api.Accounts.nbalanced(myAccount);
        api.Debits.create({
            amount: 9800,
            hold_uri: myHold.uri
        }, function (err, object) {
            if (err) {
                console.error("api.Debits.create", err);
                throw err;
            }
            myDebit = object;
            console.log("Created Debit:", myDebit.uri);
            next("api.Debits.create");
        });
    },
    function (next) {
        api.Debits.create({
            amount: 20000,
            appears_on_statement_as: "TEST2CARD",
            description: "test debit on card",
            source_uri: myAccountCard.uri
        }, function (err, object) {
            if (err) {
                console.error("api.Debits.create2", err);
                throw err;
            }
            myDebit = object;
            console.log("Created Debit:", myDebit.uri);
            next("api.Debits.create2");
        });
    },
    function (next) {
        api.Debits.refund(myDebit.uri, function (err, object) {
            if (err) {
                console.error("api.Debits.refund", err);
                throw err;
            }
            myRefund = object;
            console.log("Refunded Debit:", myRefund.uri);
            next("api.Debits.refund");
        });
    },
    function (next) {
        api.Debits.create({
            amount: 60000,
            appears_on_statement_as: "TEST2BANK",
            description: "test debit on bank account",
            source_uri: myAccountBankAccount.uri
        }, function (err, object) {
            if (err) {
                console.log("api.Debits.create3", myAccountBankAccount.uri);
                console.error("api.Debits.create3", err);
                throw err;
            }
            myDebit = object;
            console.log("Created Debit:", myDebit.uri);
            next("api.Debits.create3");
        });
    },
    function (next) {
        api.Debits.get(myDebit.uri, function (err, object) {
            if (err) {
                console.error("api.Debits.get", err);
                throw err;
            }
            console.log("Retrieved Debit:", object.uri);
            next("api.Debits.get");
        });
    },
    function (next) {
        api.Debits.list(function (err, object) {
            if (err) {
                console.error("api.Debits.list", err);
                throw err;
            }
            console.log("List Debits:", object.total, "total");
            next("api.Debits.list");
        });
    },
    function (next) {
        api.Debits.update(myDebit.uri, {
            description: "updated debit description",
            meta: {
                test: true
            },
            "illegal-property": "This should not be saved"
        }, function (err, object) {
            if (err) {
                console.error("api.Debits.update", err);
                throw err;
            }
            console.log("Updated Debit:", object.uri);
            next("api.Debits.update");
        });
    },







    // ***********************************************************
    // Credits
    // ***********************************************************
    function (next) {
        api.Credits.create({
            amount: 100,
            bank_account: {
                routing_number: "021000021",
                account_number: "9900000002",
                type: "checking",
                name: "Jennifer Aston"
            }
        }, function (err, object) {
            if (err) {
                console.log("", err);
                throw err;
            }
            myCredit = object;
            console.log("api.Credits.create", myCredit.uri);
            next("api.Credits.create");
        });
    },
    function (next) {
        api.Credits.add(myAccountBankAccount.credits_uri, 3400, "Have some free money", function (err, object) {
            if (err) {
                console.error("api.Credits.add", err);
                throw err;
            }
            console.log("Credit Bank Account", object.uri);
            next("api.Credits.add");
        });
    },
    function (next) {
        api.Credits.add(myAccountBankAccount.credits_uri, { amount: 3400, description: "Have some free money", appears_on_statement_as: "ACME Corp" },  function (err, object) {
            if (err) {
                console.error("api.Credits.add2", err);
                throw err;
            }
            console.log("Credit Bank Account", object.uri);
            next("api.Credits.add2");
        });
    },
    // This is here because we have to have money from a prior sequence before we can test this shortcut
    //  method on bandAccount.
     function (next) {
         api.BankAccounts.credit(myAccountBankAccount.credits_uri, 600, "Have some free money", function (err, object) {
             if (err) {
                 console.error("api.BankAccounts.credit", err);
                 throw err;
             }
             console.log("Credit Bank Account", object.uri);
             next("api.BankAccounts.credit");
         });
    },
    // Now this should return something, exactly 1 credit hopefully.
    function (next) {
        api.BankAccounts.credits(myAccountBankAccount.credits_uri, function (err, object) {
            if (err) {
                console.error("api.BankAccounts.credits", err);
                throw err;
            }
            console.log("Bank Account Credits", object.total, "total");
            next("api.BankAccounts.credits");
        });
    },
    function (next) {
        api.Credits.get(myCredit.uri, function (err, object) {
            if (err) {
                console.error("api.Credits.get", err);
                throw err;
            }
            console.log("Retrieved Credit:", object.uri);
            next("api.Credits.get");
        });
    },
    function (next) {
        api.Credits.list(function (err, object) {
            if (err) {
                console.error("api.Credits.list", err);
                throw err;
            }
            console.log("List Credits:", object.total, "total");
            next("api.Credits.list");
        });
    },





    // ***********************************************************
    // Refunds
    // ***********************************************************
    function (next) {
        api.Debits.create({
            amount: 20000,
            appears_on_statement_as: "TEST3CARD",
            description: "test debit on card",
            source_uri: myAccountCard.uri
        }, function (err, object) {
            if (err) {
                console.error("api.Debits.create4", err);
                throw err;
            }
            myDebit = object;
            console.log("Created Debit:", myDebit.uri);
            next("api.Debits.create4");
        });
    },
    function (next) {
        api.Refunds.create(myDebit.uri, {
            description: "Customer is happy, but likes money too much",
            meta: {
                customer: "bob",
                is_wicket_smaht: true
            }
        }, function (err, object) {
            if (err) {
                console.log("api.Refunds.create", err);
                throw err;
            }
            myRefund = object;
            console.log("api.Refunds.create", myRefund.uri);
            next("api.Refunds.create");
        });
    },
    function (next) {
        api.Refunds.get(myRefund.uri, function (err, object) {
            if (err) {
                console.error("api.Refunds.get", err);
                throw err;
            }
            myRefund = object;
            console.log("Retrieved Refunds:", object.uri);
            next("api.Refunds.get");
        });
    },
    function (next) {
        api.Refunds.list(function (err, object) {
            if (err) {
                console.error("api.Refunds.list", err);
                throw err;
            }
            console.log("List Refunds:", object.total, "total");
            next("api.Refunds.list");
        });
    },
    function (next) {
        api.Refunds.update(myDebit.uri, {
            description: "updated refund description",
            meta: {
                test: true
            },
            "illegal-property": "This should not be saved"
        }, function (err, object) {
            if (err) {
                console.error("api.Refunds.update", err);
                throw err;
            }
            console.log("Updated Refund:", object.uri);
            next("api.Refunds.update");
        });
    },

    // ***********************************************************
    // Reversals
    // ***********************************************************
    function (next){
	console.log("creating dummy data for reversals");
	api.BankAccounts.create({
	    name: "lolz master",
	    routing_number:   "321174851",
	    account_number:"9900000003",
	    type: "checking"
	}, function (err, object){
	    if(err) {
		console.error("api.BankAccount.create reversals", err);
		throw err;
	    }
	    myBankAccount = object;
	    api.Credits.add(myBankAccount.account.credits_uri, 1234, function (err, object){
		debugger;
		if(err) {
		    console.error("api.Credits.add reversals", err);
		    throw err;
		}
		myCredit = object;
		api = new nbalanced(config);
		next("api.Reversals setup");
	    });

	});
    },
    function (next) {
	api.Reversals.create(myCredit, function (err, object) {
	    if(err) {
		console.error("api.Reversals.create", err);
		throw err;
	    }
	    myReversal = object;
	    console.log("Reversal created: ", object.uri);
	    next("api.Reversals.create");
	});
    },
    function (next){
	api.Reversals.get(myReversal.uri, function (err, object){
	    if(err) {
		console.err("api.Reversals.get", err);
		throw err;
	    }
	    next("api.Reversals.get");
	});
    },
    function (next){
	api.Reversals.list(function (err, object){
	    if(err) {
		console.error("api.Reversals.list", err);
		throw err;
	    }
	    next("api.Reversals.list");
	})
    },
    function (next){
	api.Reversals.update(myReversal.uri, { 'description': 'new test' }, function (err, result){
	    if(err){
		console.error("api.Reversals.update", err);
		throw err;
	    }
	    next("api.Reversals.update");
	})
    },






    // ***********************************************************
    // Events
    // ***********************************************************
    function (next) {
	api.Events.list({
	    offset: 0,
	    limit: 50
	}, function(err, object) {
	    if(err) {
		console.error("api.Events.list", err);
		throw err;
	    }
	    console.log("List Events", object.uri);
	    assert(object.items.length, "No events were listed");
	    myEvent = object.items[0];
	    next("api.Events.list");
	});
    },
    function (next) {
	api.Events.get(myEvent.uri, function(err, object) {
	    if(err) {
		console.error("api.Events.get", err);
		throw err;
	    }
	    console.log("Retrieved Event", object.uri);
	    next("api.Events.get");
	});
    },


    // ***********************************************************
    // Build Docs
    // ***********************************************************
    function (next) {
	var child_process = require('child_process');
	var render = child_process.spawn('node', [__dirname + '/../scenarios/render.js']);
	render.stdout.on('data', function(data) {
	    console.log("Render: "+ data);
	});
	render.stderr.on('data', function(data) {
	    console.log("Render err: "+ data);
	});
	render.on('exit', function(code) {
	    console.log(arguments);
	    if(code !== 0) {
		console.error("Render templates");
		throw "Render Template error";
	    }
	    console.log("Scenarios templates rendered");
	    next("Templates render");
	});
    },


    // Default end sequence function, makes copy/paste easier w/ the commas
    function (next) {
        next("Sequence Complete");
    }


], function (results) {
    console.log("Done; completed the following tests:");
    console.log(results);
    process.exit(results[results.length-1][0] == "Sequence Complete" ? 0 : results.length+1);
});
