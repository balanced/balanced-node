% if mode == 'definition': 
balanced.Refunds.update

% else:
var balanced_library = require('balanced');

var balanced = new balanced_library({
    marketplace_uri: "${api_location}",
    secret: "${ctx.api_key}"
});

balanced.Refunds.update("/v1/marketplaces/TEST-MP6E3EVlPOsagSdcBNUXWBDQ/refunds/RF1bNMx3J48PAiYNJMga00YE",
		       { description: "Not Testing balanced" },
		       function(err, result) {
    /* . . . */
});

% endif
