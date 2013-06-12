% if mode == 'definition': 
balanced.Customers.update

% else:
var balanced_library = require('balanced');

var balanced = new balanced_library({
    marketplace_uri: "${api_location}",
    secret: "${ctx.api_key}"
});

balanced.Customers.update("/v1/customers/CU4Ge9p0xB21u0QcFv55rMHJ",
			 { name: "Alan Turing" },
			 function(err, result) {
    /* . . . */
});

% endif
