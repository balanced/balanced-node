% if mode == 'definition': 
balanced.Holds.capture

% else:
var balanced_library = require('balanced');

var balanced = new balanced_library({
    marketplace_uri: "${api_location}",
    secret: "${ctx.api_key}"
});

balanced.Holds.capture("${request['uri']}", function(err, result) {
    /* . . . */
});

% endif
