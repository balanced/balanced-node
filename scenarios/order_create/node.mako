% if mode == 'definition': 
balanced.customer.orders.create()

% else:
<%!
    import json

    def to_json( d ):
        return json.dumps( d , indent=4)
%>

var balanced = require('balanced-official');

balanced.configure('${ctx.api_key}');

balanced.get('${request.get('customer_href', request.get('payload', {}).get('customer'))}').orders.create(${to_json( request['payload'] ) | n })

% endif
