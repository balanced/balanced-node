% if mode == 'definition': 

% else:
var balanced_library = require('balanced');

var balanced = new balanced_library({
    marketplace_uri: "${api_location}",
    secret: "${ctx.api_key}"
});

balanced.BankAccounts.get("${request['uri']}", function(err, result) {
    balanced.BankAccounts.credit(result.credits_uri, ${payload['amount']},
				"${payload['description']}", function(err, result) {
				    /* . . . */
    });
});

% endif
