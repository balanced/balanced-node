% if mode == 'definition': 
balanced.Events.get

% else:
var balanced_library = require('balanced');

var balanced = new balanced_library({
    marketplace_uri: "${api_location}",
    secret: "${ctx.api_key}"
});

balanced.Events.get("/v1/events/EVda9622507c9311e2b21f026ba7cac9da", function(err, result) {
    /* . . . */
});

% endif
