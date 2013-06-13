{{api}}.BankAccounts.get("{{uri.bankAccount}}", function(err, result) {
    {{api}}.BankAccounts.credit(result.credits_uri, {{amount}},
				"", function(err, result) {
				    LOG
    });
});
