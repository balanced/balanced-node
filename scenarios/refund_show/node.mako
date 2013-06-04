% if mode == 'definition': 
balanced.Refunds.get

% else:
var balanced_library = require('balanced');

var balanced = new balanced_library({
    marketplace_uri: "/v1/marketplaces/TEST-MP1Qgo2GJ01p1Unq365Gq8Hw",
    secret: "3c49b172ca1611e29e4e026ba7f8ec28"
});

balanced.Refunds.get("/v1/marketplaces/TEST-MP6E3EVlPOsagSdcBNUXWBDQ/refunds/RF1bNMx3J48PAiYNJMga00YE", function(err, result) {
    /* . . . */
});

% endif
