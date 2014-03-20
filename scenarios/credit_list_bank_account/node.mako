% if mode == 'definition': 
balanced.get().credits

% else:
<%!
    import json

    def to_json( d ):
        return json.dumps( d , indent=4)
%>

var balanced = require('balanced-official');

balanced.configure('${ctx.api_key}');

balanced.get('${request.get('bank_account_href', request.get('bank_account_uri'))}').credits

% endif
