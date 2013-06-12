% if mode == 'definition': 
balanced.Accounts.addCard

% else:
var balanced_library = require('balanced');

var balanced = new balanced_library({
    marketplace_uri: "${api_location}",
    secret: "${ctx.api_key}"
});

balanced.Accounts.addCard("${request['uri']}",
			 "${request['uri']}",
			 function(err, result) {
    /* . . . */
});

% endif
