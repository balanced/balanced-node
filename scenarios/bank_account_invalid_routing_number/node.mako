% if mode == 'definition': 

% else:
var balanced_library = require('balanced');

var balanced = new balanced_library({
    marketplace_uri: "/v1/marketplaces/TEST-MP1Qgo2GJ01p1Unq365Gq8Hw",
    secret: "3c49b172ca1611e29e4e026ba7f8ec28"
});

balanced.BankAccounts.create({
      name: "Johann Bernoulli",
      account_number: "9900000001",
      routing_number: "0000000000",
      type: "checking"
    }, function(err, result) {
	if(err) {
	    console.log(err.description);
	    throw err;
	}

    });

% endif
