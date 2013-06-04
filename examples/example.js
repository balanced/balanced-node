// load the balanced module
var balanced = require('..');
var assert = require('assert');


console.log("Making Test market place");
balanced.MakeTestMarket(function(err, config) {
    assert(!err, "Problem creating test marketplace");
    console.log("Our secret is:", config.secret);
    console.log("Marketplace:", config.marketplace_uri);

    var api = new balanced(config);
    console.log("Getting info about marketplace");
    api.Marketplaces.get(function(err, marketplace_result) {
	console.log("The marketplace name:", marketplace_result.name);
	console.log("Updating the marketplace name");
	var test_name = "The new test Name "+Math.random();
	api.Marketplaces.update({ name: test_name }, function(err, marketplace_update_result) {
	    assert(!err, "Problem updating market");
	    assert.equal(marketplace_update_result.name, test_name, "Marketplace name did not update");

	    console.log("Creating a test card");
	    api.Cards.create({
		card_number: "5105105105105100",
		expiration_month: "12",
		expiration_year: "2018"
	    }, function(err, card_result) {
		assert(!err, "Problem creating test card");
		console.log("Card uri:", card_result.uri);
		console.log("Creating a test buyer");
		api.Customers.create({
		    email: "buyer@example.com"
		}, function(err, customer_result) {
		    assert(!err, "Problem creating Customer");
		    var customer = api.Customers.balanced(customer_result);
		    console.log("Buyer uri:", customer_result.uri);
		    customer.Customers.addCard(card_result.uri, function(err, add_card_result) {
			assert(!err, "Problem adding card to Customer");
			console.log("Creating a hold");
			customer.Holds.create({ amount: 1500 }, function(err, hold_result) {
			    assert(!err, "Problem creating hold");
			    //console.log(arguments);
			    console.log("Capture the hold");
			    api.Holds.capture(hold_result.uri, {}, function(err, hold_capture_result) {
				assert(!err, "Problem capturing hold");
				//console.log(arguments);
				api.Marketplaces.get(function(err, marketplace_result) {
				    console.log("Marketplace has in escrow", marketplace_result.in_escrow);
				    //console.log(marketplace_result);
				    assert(!err, "Problem getting the marketplace");
				    assert.equal(marketplace_result.in_escrow, 1500, "Unexpected amount in market escrow");
				    api.Refunds.create(hold_capture_result.uri,
						       {},
						       function(err, refund_result) {
					assert(!err, "Problem creating refund");
					bank_Account_tests(api, customer, card_result);
					//console.log(arguments);

				    });
				});
			    });
			});
			//console.log(arguments);
		    });
		});
		/*
		  api.Accounts.create({
		  email: "buyer@example.com",
		  card: card_result.uri
		  }, function(err, customer_result) {
		  console.log(arguments);
		  });*/
		//console.log(card_result);
	    });

	    //console.log(api);

	});

    });

});


function bank_Account_tests(api, customer, card_result) {
    console.log("Creating bank account");
    api.BankAccounts.create({
	account_number: "1234567890",
	routing_number: "321174851",
	name: "Jack Q Merchant",
	type: "checking"
    }, function(err, bank_result) {
	assert(!err, "Problem creating bank account");
	console.log("Creating account");
	api.Accounts.create(function(err, account_result) {
	    assert(!err, "Problem creating account");
	    var account = api.Accounts.balanced(account_result);
	    console.log("Adding bank account to account");
	    api.Accounts.addBankAccount(account_result.uri, bank_result.uri, function(err, bank_add_result) {
		assert(!err, "Problem adding bank Account");
		account.Accounts.underwrite({
		    type: "person",
		    person: {
			name: "Billy Jones",
			street_address: "801 High St.",
			postal_code: "94301",
			country: "USA",
			dob: "1842-01",
			phone_number: "+16505551234"
		    }
		}, function(err, underwrite_result) {
		    console.log("Debiting the buyer");
		    customer.Debits.create({ amount: 13000 }, function (err, debit_result) {
			assert(!err, "Problem debiting customer");
			console.log("Crediting Account");
			//console.log(account_result);
			account.Credits.add(account_result.credits_uri, 11000, function(err, credits_result) {
			    //console.log(arguments);
			    assert(!err, "Problem crediting account");
			    api.Marketplaces.get(function(err, marketplace_result) {
				assert(!err, "Problem getting marketplace");
				var owner = api.Customers.balanced(marketplace_result.owner_account);
				owner.Credits.add(marketplace_result.owner_account.credits_uri,
						  2000, function(err, owner_credit_result) {
				    assert(!err, "Problem crediting marketplace owner");
				    delete_test(api, card_result, bank_result);
				});
				//marketplace_result.owner_account.customer
			    });
			});
		    });
		});
	    });
	});

    });
}

function delete_test(api, card_result, bank_result) {
    console.log("Invalidating card");
    api.Cards.invalidate(card_result.uri, function(err, invalidate_result) {
	assert(!err, "Problem invalidating card");
	assert.equal(invalidate_result.is_valid, false, "Card not invalidated");
	api.BankAccounts.delete(bank_result.uri, function(err, bank_delete_result) {
	    assert(!err, "Problem deleting bank account");
	    //console.log(arguments);
	    check_test(api);
	});
	//console.log(arguments);
    });
}


function check_test(api) {
    api.Accounts.list(function(err, account_list_result) {
	assert(!err, "There was a problem getting the accounts list");
	api.Customers.list(function(err, customer_list_result) {
	    assert(!err, "There was a problem getting the customers list");
	    console.log("There are", account_list_result.items.length, "accounts, and", customer_list_result.items.length, "customers");
	});
    });

}
