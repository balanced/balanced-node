% if mode == 'definition': 
balanced.Credits.add

% else:
var balanced_library = require('balanced');

var balanced = new balanced_library({
    marketplace_uri: "${api_location}",
    secret: "${ctx.api_key}"
});

balanced.Credits.add("${request['uri']}", ${payload['amount']}, "${payload['description']}",
		    function(err, result) {
    /* . . . */
});

% endif
