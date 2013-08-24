% if mode == 'definition': 
balanced.Customers.addCard

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

balanced.Customers.addCard("${request.get('uri')}",
                          "${request.get('payload').get('card_uri')}",
                          function(err, result) {
    console.error(err);
    console.log(result);
});

% endif
