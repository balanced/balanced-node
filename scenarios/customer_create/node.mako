% if mode == 'definition': 
balanced.Customers.create

% else:
var balanced_library = require('balanced');

var balanced = new balanced_library({
    marketplace_uri: "${api_location}",
    secret: "${ctx.api_key}"
});

balanced.Customers.create({

}, function(err, result) {
    /* . . . */
});

% endif
