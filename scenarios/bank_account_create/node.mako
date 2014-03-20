% if mode == 'definition': 
balanced.marketplace.bank_accounts.create()

% else:
<%!
    import json

    def to_json( d ):
        return json.dumps( d , indent=4)
%>

var balanced = require('balanced-official');

balanced.configure('${ctx.api_key}');

balanced.marketplace.bank_accounts.create(${to_json( request['payload'] ) | n })

% endif
