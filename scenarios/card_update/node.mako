% if mode == 'definition': 
balanced.Cards.update

% else:
var balanced_library = require('balanced');

var balanced = new balanced_library({
    marketplace_uri: "${api_location}",
    secret: "${ctx.api_key}"
});

balanced.Cards.update("${request['uri']}", { twitter: "123456789" },
		     function(err, result) {
    /* . . . */
});

% endif
