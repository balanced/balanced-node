% if mode == 'definition': 
balanced.Accounts.addBankAccount

% else:
var balanced_library = require('balanced');

var balanced = new balanced_library({
    marketplace_uri: "${api_location}",
    secret: "${ctx.api_key}"
});

balanced.Accounts.addBankAccount("${request['uri']}", "${request['uri']}",
				function(err, result) {
    /* . . . */
});

% endif
