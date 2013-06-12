% if mode == 'definition': 
balanced.Cards.update

% else:
var balanced_library = require('balanced');

var balanced = new balanced_library({
    marketplace_uri: "${api_location}",
    secret: "${ctx.api_key}"
});

balanced.Cards.update("/v1/marketplaces/TEST-MP7KGu1qSh88k1ka9w6FvXZu/cards/CCg1bA1f1o1PEdmOweZjxYy", { twitter: "123456789" },
		     function(err, result) {
    /* . . . */
});

% endif
