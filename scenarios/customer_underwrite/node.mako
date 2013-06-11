% if mode == 'definition': 
balanced.Customers.update

% else:
var balanced_library = require('balanced');

var balanced = new balanced_library({
    marketplace_uri: "/v1/marketplaces/TEST-MP1Qgo2GJ01p1Unq365Gq8Hw",
    secret: "3c49b172ca1611e29e4e026ba7f8ec28"
});

balanced.Customers.update("/v1/customers/CU4Ge9p0xB21u0QcFv55rMHJ/refunds",
			 { name: "George Washington" },
			 function(err, result) {
    /* . . . */
});

% endif
