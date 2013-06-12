% if mode == 'definition': 
balanced.Debits.refund

% else:
var balanced_library = require('balanced');

var balanced = new balanced_library({
    marketplace_uri: "${api_location}",
    secret: "${ctx.api_key}"
});

balanced.Debits.refund("${request['uri']}", function(err, result) {
    /* . . . */
});

% endif
