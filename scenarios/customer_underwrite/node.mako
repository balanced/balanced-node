% if mode == 'definition': 
balanced.Customers.update

% else:
var balanced_library = require('balanced');

var balanced = new balanced_library({
    marketplace_uri: "${api_location}",
    secret: "${ctx.api_key}"
});

balanced.Customers.update("${request['uri']}",
			 { name: "${payload['name']}" },
			 function(err, result) {
    /* . . . */
});

% endif
