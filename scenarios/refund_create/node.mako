% if mode == 'definition': 
balanced.Refunds.create

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

balanced.Refunds.create("${request['uri']}", { amount: ${payload['amount']} },
		       function(err, result) {
    /* . . . */
});

% endif
