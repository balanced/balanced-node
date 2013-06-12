% if mode == 'definition': 
balanced.BankAccounts.create

% else:
var balanced_library = require('balanced');

var balanced = new balanced_library({
    marketplace_uri: "/v1/marketplaces/TEST-MP1Qgo2GJ01p1Unq365Gq8Hw",
    secret: "3c49b172ca1611e29e4e026ba7f8ec28"
});

balanced.BankAccounts.create({
    name: "Alan Turing",
    account_number: "2345617845",
    routing_number: "321174851",
    type: "checking"
}, function(err, result) {
    /* . . . */
});

% endif
