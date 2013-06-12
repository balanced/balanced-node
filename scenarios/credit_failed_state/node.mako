% if mode == 'definition': 
balanced.Credits.create

% else:
var balanced_library = require('balanced');

var balanced = new balanced_library({
    marketplace_uri: "${api_location}",
    secret: "${ctx.api_key}"
});

balanced.Credits.create({
    amount: 2800,
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
