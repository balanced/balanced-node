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
	name: "Timmy Q. CopyPasta",
	account_number: "2345617845",
	routing_number: "321174851"
	type: "Checking"
    },
    amount: "5100"
}, function(err, result) {
    /* . . . */
});

% endif
