% if mode == 'definition': 
balanced.Events.get

% else:
var balanced_library = require('balanced');

var balanced = new balanced_library({
    marketplace_uri: "/v1/marketplaces/TEST-MP1Qgo2GJ01p1Unq365Gq8Hw",
    secret: "3c49b172ca1611e29e4e026ba7f8ec28"
});

balanced.Events.get("/v1/events/EVda9622507c9311e2b21f026ba7cac9da", function(err, result) {
    /* . . . */
});

% endif
