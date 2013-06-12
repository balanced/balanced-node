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

balanced.BankAccounts.create({
      name: "${payload['name']}",
      account_number: "${payload['account_number']}",
      routing_number: "0000000000",
      type: "checking"
    }, function(err, result) {
	if(err) {
	    console.error(err);
	    throw err;
	}
	/* . . . */
    });

% endif
