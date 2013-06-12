% if mode == 'definition': 
balanced.Events.list

% else:
var balanced_library = require('balanced');

var balanced = new balanced_library({
    marketplace_uri: "${api_location}",
    secret: "${ctx.api_key}"
});

balanced.Events.list({ offset: 0, limit: 10 }, function(err, result) {
    /* . . . */
});

% endif
