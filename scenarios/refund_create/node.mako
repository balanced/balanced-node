% if mode == 'definition': 
balanced.Refunds.create

% else:
var balanced_library = require('balanced');

var balanced = new balanced_library({
    marketplace_uri: "${api_location}",
    secret: "${ctx.api_key}"
});

balanced.Refunds.create("${request['uri']}", { amount: ${payload['amount']} },
		       function(err, result) {
    /* . . . */
});

% endif
