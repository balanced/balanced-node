% if mode == 'definition': 
balanced.Credits.create

% else:
var balanced_library = require('balanced');

var balanced = new balanced_library({
    marketplace_uri: "/v1/marketplaces/TEST-MP1Qgo2GJ01p1Unq365Gq8Hw",
    secret: "3c49b172ca1611e29e4e026ba7f8ec28"
});

balanced.Credits.create({
    amount: 5700,
    bank_account: {
	name: "Johann Bernoulli",
	account_number: "9900000001",
	routing_number: "021000021",
	type: "checking"
    }
}, function(err, result) {
    /* . . . */
});

% endif
