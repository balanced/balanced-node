% if mode == 'definition': 
balanced.get().associate_to_customer()

% else:
<%!
    import json

    def to_json( d ):
        return json.dumps( d , indent=4)
%>

var balanced = require('balanced-official');

balanced.configure('${ctx.api_key}');

balanced.get('${request['uri']}')
    .associate_to_customer('${request.get('customer_href', request.get('payload', {}).get('customer'))}')

% endif
