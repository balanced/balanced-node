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

balanced.get('${request['customer_href']}').orders.create(
		${to_json( request ) | n }
)

% endif
