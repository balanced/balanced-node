% if mode == 'definition': 
balanced.Cards.create

% else:
var balanced_library = require('balanced');

var balanced = new balanced_library({
    marketplace_uri: "${api_location}",
    secret: "${ctx.api_key}"
});

balanced.Cards.create({
    card_number: "4111111111111111",
    expiration_year: 2021,
    expiration_month: 10,
    security_code: "123"
}, function(err, result) {
    /* . . . */
});

% endif
