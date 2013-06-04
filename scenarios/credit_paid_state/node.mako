% if mode == 'definition': 
balanced.Credits.create

% else:
var balanced_library = require('balanced');

var balanced = new balanced_library({
    marketplace_uri: "/v1/marketplaces/TEST-MP1Qgo2GJ01p1Unq365Gq8Hw",
    secret: "3c49b172ca1611e29e4e026ba7f8ec28"
});

balanced.Credits.create({
    bank_account: {
	name: "Timmy Q. CopyPasta",
	account_number: "2345617845",
	routing_number: "321174851"
	type: "Checking"
    },
    amount: "7600"
}, function(err, result) {
    /* . . . */
});

% endif
