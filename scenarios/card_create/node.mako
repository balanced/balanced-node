% if mode == 'definition': 
balanced.Cards.create

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

balanced.Cards.create({
    card_number: "${payload['card_number']}",
    expiration_year: ${payload['expiration_year']},
    expiration_month: ${payload['expiration_month']},
    security_code: ""
}, function(err, result) {
    /* . . . */
});

% endif
