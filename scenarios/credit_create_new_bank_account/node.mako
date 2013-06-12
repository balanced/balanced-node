% if mode == 'definition': 
balanced.Credits.create

% else:
var balanced_library = require('balanced');

var balanced = new balanced_library({
    marketplace_uri: "${api_location}",
    secret: "${ctx.api_key}"
});

balanced.Credits.create({
    amount: 0100,
    bank_account: {
	name: "Dennis Ritchie",
	account_number: "9473857386",
	routing_number: "122000030",
	type: "checking"
    }
}, function(err, result) {
    /* . . . */
});

% endif
