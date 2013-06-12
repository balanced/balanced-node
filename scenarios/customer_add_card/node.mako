% if mode == 'definition': 
balanced.Customers.addCard

% else:
var balanced_library = require('balanced');

var balanced = new balanced_library({
    marketplace_uri: "${api_location}",
    secret: "${ctx.api_key}"
});

balanced.Customers.addCard("${request['uri']}", function(err, result) {
    /* . . . */
});

% endif
