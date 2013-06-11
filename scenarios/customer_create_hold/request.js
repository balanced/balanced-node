{{api}}.Customers.get("{{uri.customer}}", function(err, result) {
    var {{user}} = {{api}}.Customers.balanced(result);
    {{user}}.Holds.create({ amount: "{{amount}}" }, function(err, result) {
	LOG
    });
});
