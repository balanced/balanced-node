% if mode == 'definition': 
balanced.get().confirm()

% else:
<%!
    import json

    def to_json( d ):
        return json.dumps( d , indent=4)
%>

var balanced = require('balanced-official');

balanced.configure('${ctx.api_key}');

balanced.get('${request['uri']}').confirm(1,1);

% endif
