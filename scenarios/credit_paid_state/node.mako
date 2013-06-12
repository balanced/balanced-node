% if mode == 'definition': 
balanced.Credits.create

% else:
var balanced_library = require('balanced');

var balanced = new balanced_library({
    marketplace_uri: "${api_location}",
    secret: "${ctx.api_key}"
});

balanced.Credits.create({
    bank_account: {
	name: "${payload['name']}",
	account_number: "${payload['account_number']}",
	routing_number: "${payload['routing_number']}"
	type: "Checking"
    },
    amount: "${payload['amount']}"
}, function(err, result) {
    /* . . . */
});

% endif
