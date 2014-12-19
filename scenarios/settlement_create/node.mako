% if mode == 'definition': 
balanced.get().settle()

% else:
<%!
    import json

    def to_json( d ):
        return json.dumps( d , indent=4)
%>

var balanced = require('balanced-official');

balanced.configure('${ctx.api_key}');

balanced.get('${request['href']}').settle(${to_json( request['payload'] ) | n })

% endif
