% if mode == 'definition': 
balanced.Credits.add

% else:
var balanced_library = require('balanced');

var balanced = new balanced_library({
    marketplace_uri: "${api_location}",
    secret: "${ctx.api_key}"
});

balanced.Credits.add("/v1/bank_accounts/BA7MzJVqI9vsOl4FGqOowxg4", 2500, "Testing balanced",
		    function(err, result) {
    /* . . . */
});

% endif
