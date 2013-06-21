% if mode == 'definition': 

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

balanced.BankAccounts.get("${request['uri']}", function(err, result) {
    balanced.BankAccounts.credit(result.credits_uri, ${payload['amount'] if payload else request['amount'] or '1100'},
				"", function(err, result) {
				    /* . . . */
    });
});

% endif
