{{api}}.Accounts.get("{{uri.account}}", function(err, result) {
    var {{user}} = {{api}}.Accounts.nbalanced(result);
    {{user}}.Credits.list({ limit: 10, offset: 0 }, function(err, result) {
	LOG
    });
});
