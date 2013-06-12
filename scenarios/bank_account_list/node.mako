% if mode == 'definition': 
balanced.BankAccounts.list

% else:
var balanced_library = require('balanced');

var balanced = new balanced_library({
    marketplace_uri: "${api_location}",
    secret: "${ctx.api_key}"
});

balanced.BankAccounts.list({ number: 10, offset: 0 }, function (err, result) {

});

% endif
