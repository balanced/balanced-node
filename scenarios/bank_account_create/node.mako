% if mode == 'definition': 
balanced.BankAccounts.create

% else:
var balanced_library = require('balanced');

var balanced = new balanced_library({
    marketplace_uri: "${api_location}",
    secret: "${ctx.api_key}"
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
