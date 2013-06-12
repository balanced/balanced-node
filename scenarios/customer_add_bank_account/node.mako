% if mode == 'definition': 
balanced.Customers.addBankAccount

% else:
var balanced_library = require('balanced');

var balanced = new balanced_library({
    marketplace_uri: "${api_location}",
    secret: "${ctx.api_key}"
});

balanced.Customers.addBankAccount("/v1/customers/CU4Ge9p0xB21u0QcFv55rMHJ", "/v1/bank_accounts/BA7MzJVqI9vsOl4FGqOowxg4",
				 function(err, result) {
    /* . . . */
});

% endif
