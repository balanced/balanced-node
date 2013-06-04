{{api}}.BankAccounts.get("{{uri.bankAccount}}", function(err, result) {
    {{api}}.BankAccounts.verify(result.verifications_uri, function(err, result) {

    });
});
