% if mode == 'definition': 
balanced.Holds.capture

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

balanced.Holds.capture("${request.get('uri',  request.get('hold_uri', ''))}",
    description: "${ payload.get('description') if 'payload' in locals() else request['payload']['description'] }",
    appears_on_statement_as: "${request['payload']['appears_on_statement_as']}"
},
		      function(err, result) {
    /* . . . */
});

% endif
