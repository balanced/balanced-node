% if mode == 'definition': 
balanced.Credits.create

% else:
var balanced_library = require('balanced');

var balanced = new balanced_library({
    marketplace_uri: "${api_location}",
    secret: "${ctx.api_key}"
});

balanced.Credits.create({
    amount: 4500,
    bank_account: {
	name: "George Washington",
	account_number: "9473857386",
	routing_number: "122000030",
	type: "checking"
    }
}, function(err, result) {
    /* . . . */
});

% endif
