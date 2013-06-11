{{api}}.BankAccounts.get("{{uri.bankAccount}}", function(err, result) {
    {{api}}.BankAccounts.confirm(result.verifications_uri, 01, 01,
				 function(err, result) {
	LOG
    });
});
