% if mode == 'definition': 
balanced.Refunds.update

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

balanced.Refunds.update("${request['uri']}",
		       { description: "${ payload.get('description') if 'payload' in locals() else request['payload']['description'] }" },
		       function(err, result) {
    /* . . . */
});

% endif
