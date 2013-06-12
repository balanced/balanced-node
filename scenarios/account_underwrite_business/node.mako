% if mode == 'definition': 
balanced.Accounts.underwrite

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

balanced.Accounts.underwrite(${to_json( payload['merchant'] ) | n },
			     function(err, result) {
    /* . . . */
});

% endif
