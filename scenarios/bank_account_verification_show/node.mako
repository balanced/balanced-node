% if mode == 'definition': 
balanced.BankAccounts.verifications

% else:
var balanced_library = require('balanced');

var balanced = new balanced_library({
    marketplace_uri: "${api_location}",
    secret: "${ctx.api_key}"
});

balanced.BankAccounts.get("${request['uri']}", function(err, result) {
    balanced.BankAccounts.verifications(result.verifications_uri,
				       function(err, result) {
	/* . . . */
    });
});

% endif
