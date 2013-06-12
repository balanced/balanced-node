% if mode == 'definition': 
balanced.Holds.update

% else:
var balanced_library = require('balanced');

var balanced = new balanced_library({
    marketplace_uri: "/v1/marketplaces/TEST-MP1Qgo2GJ01p1Unq365Gq8Hw",
    secret: "3c49b172ca1611e29e4e026ba7f8ec28"
});

balanced.Holds.update("/v1/marketplaces/TEST-MP6E3EVlPOsagSdcBNUXWBDQ/holds/HLEEkOOAHJAU5SCfR5fi7TW",
		     { description: "Not Testing balanced" },
		     function(err, result) {
    /* . . . */
});

% endif
