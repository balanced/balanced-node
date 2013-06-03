{{api}}.Accounts.get("{{uri.account}}", function(err, result) {
    var {{user}} = {{api}}.Accounts.nbalanced(result);
    {{user}}.Credits.create({ amount: {{amount}} }, function(err, result) {
	LOG
    });
});
