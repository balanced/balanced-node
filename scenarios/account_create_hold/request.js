{{api}}.Accounts.get("{{uri.account}}", function(err, result) {
    var {{user}} = {{api}}.Accounts.nbalanced(result);
    {{user}}.Holds.create({ amount: {{amount}} }, function(err, result) {
	LOG
    });
});
