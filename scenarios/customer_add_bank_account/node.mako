% if mode == 'definition': 
balanced.Customers.addBankAccount

% else:
var balanced_library = require('balanced');

var balanced = new balanced_library({
    marketplace_uri: "${api_location}",
    secret: "${ctx.api_key}"
});

balanced.Customers.addBankAccount("${request['uri']}", "${request['uri']}",
				 function(err, result) {
    /* . . . */
});

% endif
