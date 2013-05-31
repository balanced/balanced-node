{{api}}.Accounts.get("{{uri.account}}", function(err, result) {
    var {{user}} = {{api}}.Accounts.nbalanced(result);
    {{user}}.Holds.list({ limit: 10, offset: 0 }, function(err, result) {
	LOG
    });
});
