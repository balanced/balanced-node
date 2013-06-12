% if mode == 'definition': 
balanced.Credits.get

% else:
var balanced_library = require('balanced');

var balanced = new balanced_library({
    marketplace_uri: "${api_location}",
    secret: "${ctx.api_key}"
});

balanced.Credits.get("", function(err, result) {
    /* . . . */
});

% endif
