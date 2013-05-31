var balanced_library = require('balanced');

var {{api}} = new balanced_library({
    marketplace_uri: "{{ uri.marketplace }}",
    secret: "{{ secret }}"
});
