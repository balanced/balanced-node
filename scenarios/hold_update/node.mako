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

balanced.Holds.update("${request.get('uri',  request.get('hold_uri', ''))}",
		     { description: "Not ${ payload.get('description') if 'payload' in locals() else request['payload']['description'] }" },
		     function(err, result) {
    /* . . . */
});

% endif
