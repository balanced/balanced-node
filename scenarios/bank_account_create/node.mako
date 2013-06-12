% if mode == 'definition': 
balanced.BankAccounts.create

% else:
<%!
    import json

    def to_json( d ):
        return json.dumps( d , indent=4)
%>

var balanced_library = require('balanced');

var balanced = new balanced_library({
    marketplace_uri: "${ctx.marketplace_uri}",
    secret: "${ctx.api_key}"
});

balanced.BankAccounts.create({
    name: "${payload['name']}",
    account_number: "${payload['account_number']}",
    routing_number: "${payload['routing_number']}",
    type: "checking"
}, function(err, result) {
    /* . . . */
});

% endif
