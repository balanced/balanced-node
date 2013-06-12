% if mode == 'definition': 
balanced.BankAccounts.confirm

% else:
var balanced_library = require('balanced');

var balanced = new balanced_library({
    marketplace_uri: "${api_location}",
    secret: "${ctx.api_key}"
});

balanced.BankAccounts.get("${request['uri']}", function(err, result) {
    balanced.BankAccounts.confirm(result.verifications_uri, 01, 01,
				 function(err, result) {
	/* . . . */
    });
});

% endif
