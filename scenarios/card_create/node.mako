% if mode == 'definition': 
balanced.Cards.create

% else:
var balanced_library = require('balanced');

var balanced = new balanced_library({
    marketplace_uri: "/v1/marketplaces/TEST-MP1Qgo2GJ01p1Unq365Gq8Hw",
    secret: "3c49b172ca1611e29e4e026ba7f8ec28"
});

balanced.Cards.create({
    card_number: "4111111111111111",
    expiration_year: 2020,
    expiration_month: 6,
    security_code: "123"
}, function(err, result) {
    /* . . . */
});

% endif
