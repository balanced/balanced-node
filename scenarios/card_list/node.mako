% if mode == 'definition': 
balanced.Cards.list

% else:
var balanced_library = require('balanced');

var balanced = new balanced_library({
    marketplace_uri: "${api_location}",
    secret: "${ctx.api_key}"
});

balanced.Cards.list({ limit: 10, offset: 0 }, function(err, result) {
    /* . . . */
});

% endif
