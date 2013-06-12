% if mode == 'definition': 

% else:
var balanced_library = require('balanced');

var balanced = new balanced_library({
    marketplace_uri: "${api_location}",
    secret: "${ctx.api_key}"
});

balanced.Accounts.get("/v1/marketplaces/TEST-MP1Qgo2GJ01p1Unq365Gq8Hw/accounts/ACqnnofIf2xQlmUq12EZ7bh", function(err, result) {
    var user = balanced.Accounts.nbalanced(result);
    user.Debits.create({ amount: 7600, hold_uri: "/v1/marketplaces/TEST-MP6E3EVlPOsagSdcBNUXWBDQ/holds/HLEEkOOAHJAU5SCfR5fi7TW" },
			   function(err, result) {
	/* . . . */
    });
});

% endif
