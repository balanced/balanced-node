% if mode == 'definition': 
balanced.Accounts.addCard

% else:
var balanced_library = require('balanced');

var balanced = new balanced_library({
    marketplace_uri: "${api_location}",
    secret: "${ctx.api_key}"
});

balanced.Accounts.addCard("/v1/marketplaces/TEST-MP1Qgo2GJ01p1Unq365Gq8Hw/accounts/ACqnnofIf2xQlmUq12EZ7bh", "/v1/marketplaces/TEST-MP7KGu1qSh88k1ka9w6FvXZu/cards/CCg1bA1f1o1PEdmOweZjxYy", function(err, result) {
    /* . . . */
});

% endif
