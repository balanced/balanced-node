% if mode == 'definition': 
balanced.Accounts.addBankAccount

% else:
var balanced_library = require('balanced');

var balanced = new balanced_library({
    marketplace_uri: "${api_location}",
    secret: "${ctx.api_key}"
});

balanced.Accounts.addBankAccount("/v1/marketplaces/TEST-MP1Qgo2GJ01p1Unq365Gq8Hw/accounts/ACqnnofIf2xQlmUq12EZ7bh", "/v1/bank_accounts/BA7MzJVqI9vsOl4FGqOowxg4",
				function(err, result) {
    /* . . . */
});

% endif
