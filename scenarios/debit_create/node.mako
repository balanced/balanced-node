% if mode == 'definition': 
user.Debits.create

% else:
var balanced_library = require('balanced');

var balanced = new balanced_library({
    marketplace_uri: "/v1/marketplaces/TEST-MP1Qgo2GJ01p1Unq365Gq8Hw",
    secret: "3c49b172ca1611e29e4e026ba7f8ec28"
});

balanced.Debits.create({
    amount: 7500,
    source_uri: "/v1/marketplaces/TEST-MP7KGu1qSh88k1ka9w6FvXZu/cards/CCg1bA1f1o1PEdmOweZjxYy"
}, function(err, result) {
    /* . . . */
});

% endif
