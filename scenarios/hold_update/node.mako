% if mode == 'definition': 
balanced.Holds.update

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

balanced.Holds.update("${request['uri'] or request['hold_uri']}",
		     { description: "Not ${payload['description'] if payload else ''}" },
		     function(err, result) {
    /* . . . */
});

% endif
