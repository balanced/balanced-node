% if mode == 'definition': 
user.Debits.create

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

balanced.Debits.create({
    amount: ${payload['amount'] if payload else request['amount'] or '1100'},
    source_uri: "${request.get('uri', request.get('debits_uri',''))}"
}, function(err, result) {
    /* . . . */
});

% endif
