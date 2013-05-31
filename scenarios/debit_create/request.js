{{api}}.Accounts.get("{{uri.account}}", function(err, result) {
    var {{user}} = {{api}}.Accounts.nbalanced(result);
    {{user}}.Debits.create({ amount: {{amount}} }, function(err, result) {

    });
});


{{api}}.Customers.get("{{uri.customer}}", function(err, result) {
    var {{user}} = {{api}}.Customers.nbalanced(result);
    {{user}}.Debits.create({ amount: {{amount}} }, function(err, result) {

    });
});
