% if mode == 'definition': 
balanced.Refunds.create

% else:
var balanced_library = require('balanced');

var balanced = new balanced_library({
    marketplace_uri: "${api_location}",
    secret: "${ctx.api_key}"
});

balanced.Refunds.create("/v1/marketplaces/TEST-MP6E3EVlPOsagSdcBNUXWBDQ/debits/WDEBPPEakDQzIE6T5YVjKC4", { amount: 8600 },
		       function(err, result) {
    /* . . . */
});

% endif
