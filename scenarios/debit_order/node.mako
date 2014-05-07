% if mode == 'definition': 
balanced.get().debit_from()

% else:
<%!
    import json

    def to_json( d ):
        return json.dumps( d , indent=4)
%>

var balanced = require('balanced-official');

balanced.configure('${ctx.api_key}');

var card = balanced.get('${request['card_href']}')
balanced.get('${request['order_href']}').debit_from(card, ${payload['amount'] if payload else request['amount'] or '1100'})


% endif
