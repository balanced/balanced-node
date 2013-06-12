% if mode == 'definition': 
balanced.Customers.update

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

balanced.Customers.update("${request['uri']}",
			 { name: "${payload['name'] if payload else request['bank_account']['name']}" },
			 function(err, result) {
    /* . . . */
});

% endif
