% if mode == 'definition': 
balanced.Accounts.underwrite

% else:
var balanced_library = require('balanced');

var balanced = new balanced_library({
    marketplace_uri: "${api_location}",
    secret: "${ctx.api_key}"
});

balanced.Accounts.underwrite({
    phone_number: "+14089999999"
    name: "George Washington",
    dob: "1989-12",
    postal_code: "94110",
    type: "person",
    street_address: "21 Skriptkid Row",
}, function(err, result) {
    /* . . . */
});

% endif
