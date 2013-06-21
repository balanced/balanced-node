% if mode == 'definition': 
balanced.Refunds.list

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

balanced.Refunds.list({ limit: 10, offset: 0 }, function(err, result) {
    /* . . . */
});

% endif
