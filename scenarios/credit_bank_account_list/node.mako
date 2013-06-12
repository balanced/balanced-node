% if mode == 'definition': 
balanced.BankAccounts.credits

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

balanced.BankAccounts.get("${request['uri']}", function(err, result) {
    balanced.BankAccounts.credits(result.credits_uri, function(err, result) {
	/* . . . */
    });
});

% endif
