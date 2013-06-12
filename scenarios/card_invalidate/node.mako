% if mode == 'definition': 
balanced.Cards.invalidate

% else:
var balanced_library = require('balanced');

var balanced = new balanced_library({
    marketplace_uri: "${api_location}",
    secret: "${ctx.api_key}"
});

balanced.Cards.invalidate("${request['uri']}", function(err, result) {
    /* . . . */
});

% endif
