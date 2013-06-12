% if mode == 'definition': 
balanced.Cards.list

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

balanced.Cards.list({ limit: 10, offset: 0 }, function(err, result) {
    /* . . . */
});

% endif
