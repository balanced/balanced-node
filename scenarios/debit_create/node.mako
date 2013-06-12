% if mode == 'definition': 
user.Debits.create

% else:
var balanced_library = require('balanced');

var balanced = new balanced_library({
    marketplace_uri: "${api_location}",
    secret: "${ctx.api_key}"
});

balanced.Debits.create({
    amount: 8600,
    source_uri: "/v1/marketplaces/TEST-MP7KGu1qSh88k1ka9w6FvXZu/cards/CCg1bA1f1o1PEdmOweZjxYy"
}, function(err, result) {
    /* . . . */
});

% endif
