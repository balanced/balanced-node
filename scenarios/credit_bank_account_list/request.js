{{api}}.BankAccounts.get("{{uri.bankAccount}}", function(err, result) {
    {{api}}.BankAccounts.credits(result.credits_uri, function(err, result) {
	LOG
    });
});
