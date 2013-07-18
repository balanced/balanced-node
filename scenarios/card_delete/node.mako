% if mode == 'definition': 
balanced.Cards.unstore

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

balanced.Cards.unstore("${request.get('uri', request.get('debits_uri',''))}", function (err, result) {
    /* . . . */
});

% endif
