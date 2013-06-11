{{api}}.Customers.get("{{uri.customer}}", function (err, result) {
    var {{user}} = {{api}}.Customers.balanced(result);
    {{user}}.Debits.create({ amount: "{{amount}}" }, function(err, result) {
	LOG
    });
});
