% if mode == 'definition': 
customerContext.Debits.create(debitInfo, callback)

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

var customer = balanced.Customers.get("${request['customer_uri']}", function (err, customer) {
    console.error(err);
    console.log(customer);

    var customerContext = balanced.Customers.balanced(customer);

    var debitInfo = {
        amount: "${request.get('payload').get('amount')}",
        appears_on_statement_as: "${request.get('payload').get('appears_on_statement_as')}"
        description: "${request.get('payload').get('description')}"
    };

    customerContext.Debits.create(debitInfo, function(err, result) {
        console.error(err);
        console.log(result);
    });
});

% endif
