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

balanced.get('').debit_from(${to_json( request['payload'] ) | n })
% endif
