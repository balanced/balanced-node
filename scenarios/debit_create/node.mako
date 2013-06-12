% if mode == 'definition': 
user.Debits.create

% else:
var balanced_library = require('balanced');

var balanced = new balanced_library({
    marketplace_uri: "${api_location}",
    secret: "${ctx.api_key}"
});

balanced.Debits.create({
    amount: ${payload['amount']},
    source_uri: "${request['uri']}"
}, function(err, result) {
    /* . . . */
});

% endif
