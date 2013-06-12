% if mode == 'definition': 
balanced.Accounts.create

% else:
var balanced_library = require('balanced');

var balanced = new balanced_library({
    marketplace_uri: "${api_location}",
    secret: "${ctx.api_key}"
});

balanced.Accounts.create(function(err, result) {
    /* . . . */
});

% endif
