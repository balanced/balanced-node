% if mode == 'definition': 
balanced.Accounts.underwrite

% else:
var balanced_library = require('balanced');

var balanced = new balanced_library({
    marketplace_uri: "/v1/marketplaces/TEST-MP1Qgo2GJ01p1Unq365Gq8Hw",
    secret: "3c49b172ca1611e29e4e026ba7f8ec28"
});

balanced.Accounts.underwrite({
    phone_number: "+14089999999"
    name: "Timmy Q. CopyPasta",
    dob: "1989-12",
    postal_code: "94110",
    type: "person",
    street_address: "21 Skriptkid Row",
}, function(err, result) {
    /* . . . */
});

% endif
