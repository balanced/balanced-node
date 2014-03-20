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

balanced.get('${request['uri']}')
    .set('meta.extra', 'info')
    .save()

% endif
