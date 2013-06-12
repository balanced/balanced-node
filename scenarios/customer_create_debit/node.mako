% if mode == 'definition': 
user.Debits.create

% else:
var balanced_library = require('balanced');

var balanced = new balanced_library({
    marketplace_uri: "${api_location}",
    secret: "${ctx.api_key}"
});

balanced.Customers.get("${request['uri']}", function (err, result) {
    var user = balanced.Customers.balanced(result);
    user.Debits.create({ amount: "${payload['amount']}" }, function(err, result) {
	/* . . . */
    });
});

% endif
