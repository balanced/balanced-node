// load the balanced module
var balanced = require('..');

/**
 * Creates a new customer and card
 * Adds the card to the customer
 * charges the customer $20.00
 *
 * Creates a bank account
 * adds the bank account to the customer
 * credits the bank account (To credit a bank account the balance must be in the market place)
 *
 *
 * Note: To make this example useful you would want to check for errors and that these acctions are returning success codes
 */

balanced.MakeTestMarket(function(err, config) {
    var api = new balanced(config);

    // Create a new Customer
    api.Customers.create(
	{ // all options here are optional
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
	}, function(err, customer) {
	    console.log
	    var customer_interface = api.Customers.nbalanced(customer);
	    // Create a new credit card
	    // Normally this would be done using the javascript client side library and then
	    // getting the card uri sent to the server
	    api.Cards.create({
		card_number: "4111111111111111",
		expiration_year: 2020,
		expiration_month: 5
	    }, function(err, card) {
		// add the card to a customer
		// the card uri would normally come from the client after the card is processed
		customer_interface.Customers.addCard(card.uri, function(err, add_card) {
		    // charge the customer $20.00
		    customer_interface.Debits.create({ amount: 2000 }, function(err, debit_result) {

			// do something now that the customer's card has been charged

			// Now create a bank account
			api.BankAccounts.create({
			    name: "Miranda Benz",
			    account_number: "9900826301",
			    routing_number: "121000359",
			    type: "checking",
			    meta: {
				info: "created another test account",
				test: true
			    }
			}, function(err, bank) {
			    // bank account uri would normally come from the client side javascript library
			    customer_interface.Customers.addBankAccount(bank.uri, function(err, add_bank) {

				// Note that this is useing the credit uri of the bank account
				// if you had a user object you could use customer_interface.BankAccounts.list to get the credits_uri for the bank account
				api.Credits.add(bank.credits_uri, 1000, "testing adding money to an account", function (err, credit_result) {

				});

			    });
			});





		    });
		});
	    });
	});

});
