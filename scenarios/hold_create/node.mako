% if mode == 'definition': 
balanced.Holds.create

% else:
var balanced_library = require('balanced');

var balanced = new balanced_library({
    marketplace_uri: "${api_location}",
    secret: "${ctx.api_key}"
});

balanced.Holds.create({
    source_uri: "/v1/marketplaces/TEST-MP7KGu1qSh88k1ka9w6FvXZu/cards/CCg1bA1f1o1PEdmOweZjxYy",
    amount: 6800
}, function(err, result) {
    /* . . . */
});

% endif
