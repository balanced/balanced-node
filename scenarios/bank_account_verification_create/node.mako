% if mode == 'definition': 
balanced.BankAccounts.verify

% else:
var balanced_library = require('balanced');

var balanced = new balanced_library({
    marketplace_uri: "${api_location}",
    secret: "${ctx.api_key}"
});

balanced.BankAccounts.get("/v1/bank_accounts/BA7MzJVqI9vsOl4FGqOowxg4", function(err, result) {
    balanced.BankAccounts.verify(result.verifications_uri, function(err, result) {
	/* . . . */
    });
});

% endif
