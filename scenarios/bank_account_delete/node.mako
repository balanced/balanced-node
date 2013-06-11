% if mode == 'definition': 
balanced.BankAccounts.delete

% else:
var balanced_library = require('balanced');

var balanced = new balanced_library({
    marketplace_uri: "/v1/marketplaces/TEST-MP1Qgo2GJ01p1Unq365Gq8Hw",
    secret: "3c49b172ca1611e29e4e026ba7f8ec28"
});

balanced.BankAccounts.delete("/v1/bank_accounts/BA7MzJVqI9vsOl4FGqOowxg4", function (err, result) {
    /* . . . */
});

% endif
