% if mode == 'definition': 
balanced.Events.get

% else:
var balanced_library = require('balanced');

var balanced = new balanced_library({
    marketplace_uri: "${api_location}",
    secret: "${ctx.api_key}"
});

balanced.Events.get("${request['uri']}", function(err, result) {
    /* . . . */
});

% endif
