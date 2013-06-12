% if mode == 'definition': 

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

balanced.Accounts.get("${request['uri']}", function(err, result) {
    var user = balanced.Accounts.nbalanced(result);
    user.Credits.create({ amount: ${payload['amount']} }, function(err, result) {
	/* . . . */
    });
});

% endif
