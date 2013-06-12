{{api}}.Customers.get("{{uri.customer}}", function(err, result) {
    var {{user}} = {{api}}.Customers.nbalanced(result);
    {{user}}.Credits.create({ amount: {{amount}} }, function(err, result) {
	LOG
    });
});
