% if mode == 'definition': 

% else:
var balanced_library = require('balanced');

var balanced = new balanced_library({
    marketplace_uri: "${api_location}",
    secret: "${ctx.api_key}"
});

balanced.Accounts.get("/v1/marketplaces/TEST-MP1Qgo2GJ01p1Unq365Gq8Hw/accounts/ACqnnofIf2xQlmUq12EZ7bh", function(err, result) {
    var user = balanced.Accounts.nbalanced(result);
    user.Holds.list({ limit: 10, offset: 0 }, function(err, result) {
	/* . . . */
    });
});

% endif
