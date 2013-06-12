% if mode == 'definition': 
balanced.Debits.update

% else:
var balanced_library = require('balanced');

var balanced = new balanced_library({
    marketplace_uri: "${api_location}",
    secret: "${ctx.api_key}"
});

balanced.Debits.update("${request['uri']}", { description: "${payload['description']}" },
		      function(err, result) {
    /* . . . */
});

% endif
