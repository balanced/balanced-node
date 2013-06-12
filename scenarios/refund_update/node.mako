% if mode == 'definition': 
balanced.Refunds.update

% else:
var balanced_library = require('balanced');

var balanced = new balanced_library({
    marketplace_uri: "${api_location}",
    secret: "${ctx.api_key}"
});

balanced.Refunds.update("${request['uri']}",
		       { description: "Not ${payload['description']}" },
		       function(err, result) {
    /* . . . */
});

% endif
