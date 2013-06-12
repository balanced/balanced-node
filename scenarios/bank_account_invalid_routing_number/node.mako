% if mode == 'definition': 

% else:
var balanced_library = require('balanced');

var balanced = new balanced_library({
    marketplace_uri: "${api_location}",
    secret: "${ctx.api_key}"
});

balanced.BankAccounts.create({
      name: "Johann Bernoulli",
      account_number: "9900000001",
      routing_number: "0000000000",
      type: "checking"
    }, function(err, result) {
	if(err) {
	    console.error(err);
	    throw err;
	}
	/* . . . */
    });

% endif
