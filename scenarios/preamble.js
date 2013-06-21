<%!
    import json

    def to_json( d ):
        return json.dumps( d , indent=4)
%>

var balanced_library = require('balanced-official');

var {{api}} = new balanced_library({
    marketplace_uri: "{{ uri.marketplace }}",
    secret: "{{ secret }}"
});
