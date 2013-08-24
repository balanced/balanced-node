% if mode == 'definition': 
balanced.Customers.create

% else:
<%!
    import json

    def to_json( d ):
        return json.dumps( d , indent=4)
%>

var balanced_library = require('balanced-official');

var balanced = new balanced_library({
    marketplace_uri: "${ctx.marketplace_uri}",
    secret: "${ctx.api_key}"
});

var customerInfo = {
    name: "William Henry Cavendish III",
    email: "whc@example.org",
    meta: {
	    "customKey.first": "first",
	    "customKey.second": "second"
    },
    ssn_last4: "1234",
    business_name: "Cavendish LLC",
    address: {
	    line1: "123 Main St",
	    line2: "Apt. 1",
	    city: "San Francisco",
	    state: "CA",
	    postal_code: "94133",
	    country_code: "USA"
    },
    phone: "+19994445555",
    dob: "1984-01",
    ein: "451111111"
};
    
var customer = balanced.Customers.create(customerInfo, function(err, result) {
    console.error(err);
    console.log(result);
});

% endif
