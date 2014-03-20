% if mode == 'definition': 
balanced.credit.reverse()

% else:
<%!
    import json

    def to_json( d ):
        return json.dumps( d , indent=4)
%>

var balanced = require('balanced-official');

balanced.configure('${ctx.api_key}');

balanced.get('${request['credit_href']}').reversal(${to_json( request['payload'] ) | n })

% endif
