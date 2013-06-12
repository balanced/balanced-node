{{api}}.Customers.get("{{uri.customer}}", function(err, result) {
    var {{user}} = {{api}}.Customers.nbalanced(result);
    {{user}}.Credits.list({ limit: 10, offset: 0 }, function(err, result) {
	LOG
    });
});
