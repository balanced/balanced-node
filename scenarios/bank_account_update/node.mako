% if mode == 'definition': 
balanced.get().save()

% else:
<%!
    import json

    def to_json( d ):
        return json.dumps( d , indent=4)
%>

var balanced = require('balanced-official');

balanced.configure('${ctx.api_key}');

balanced.get('${request['uri']}').then(function (bank_account) {
    bank_account.meta = {
        'user_id': '123123123'
    };
    bank_account.save()
});

% endif
