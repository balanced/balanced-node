{{api}}.Accounts.get("{{uri.account}}", function(err, result) {
    var {{user}} = {{api}}.Accounts.nbalanced(result);
    {{user}}.Debits.list({ limit: 10, offset: 0 }, function(err, result) {
	LOG
    });
});
