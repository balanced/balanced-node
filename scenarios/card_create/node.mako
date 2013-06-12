% if mode == 'definition': 
balanced.Cards.create

% else:
var balanced_library = require('balanced');

var balanced = new balanced_library({
    marketplace_uri: "${api_location}",
    secret: "${ctx.api_key}"
});

balanced.Cards.create({
    card_number: "${payload['card_number']}",
    expiration_year: ${payload['expiration_year']},
    expiration_month: ${payload['expiration_month']},
    security_code: ""
}, function(err, result) {
    /* . . . */
});

% endif
