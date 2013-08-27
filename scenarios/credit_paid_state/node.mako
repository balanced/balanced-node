% if mode == 'definition': 
balanced.Credits.create

% else:
<%!
    import json

    def to_json( d ):
        return json.dumps( d , indent=4)
%>

var balanced_library = require('balanced-official');

var balanced = new balanced_library({
    marketplace_uri: "${ctx.marketplace_uri}",
    secret: "${ctx.api_key}"
});

balanced.Credits.create({
    bank_account: {
	name: "${payload['bank_account']['name'] if payload else request['payload']['bank_account']['name']}",
	account_number: "${payload['bank_account']['account_number'] if payload else request['payload']['bank_account']['account_number']}",
	routing_number: "${payload['bank_account']['routing_number'] if payload else request['payload']['bank_account']['routing_number']}"
	type: "Checking"
    },
    amount: "${payload['amount'] if payload else request['payload']['amount'] or '1100'}"
}, function(err, result) {
    /* . . . */
});

% endif
