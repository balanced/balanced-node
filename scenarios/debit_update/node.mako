% if mode == 'definition': 
balanced.Debits.update

% else:
var balanced_library = require('balanced');

var balanced = new balanced_library({
    marketplace_uri: "/v1/marketplaces/TEST-MP1Qgo2GJ01p1Unq365Gq8Hw",
    secret: "3c49b172ca1611e29e4e026ba7f8ec28"
});

balanced.Debits.update("/v1/marketplaces/TEST-MP6E3EVlPOsagSdcBNUXWBDQ/debits/WDEBPPEakDQzIE6T5YVjKC4", { description: "Party Supplies" },
		      function(err, result) {
    /* . . . */
});

% endif
