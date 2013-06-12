% if mode == 'definition': 
user.Debits.create

% else:
var balanced_library = require('balanced');

var balanced = new balanced_library({
    marketplace_uri: "${api_location}",
    secret: "${ctx.api_key}"
});

balanced.Customers.get("/v1/customers/CU4Ge9p0xB21u0QcFv55rMHJ", function (err, result) {
    var user = balanced.Customers.balanced(result);
    user.Debits.create({ amount: "1700" }, function(err, result) {
	/* . . . */
    });
});

% endif
