var balanced_library = require('../..');

var {{api}} = new balanced_library({
    marketplace_uri: "{{ uri.marketplace }}",
    secret: "{{ secret }}"
});

run();
