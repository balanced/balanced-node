{{api}}.BankAccounts.get("{{uri.bankAccount}}", function(err, result) {
    {{api}}.BankAccounts.verifications(result.verifications_uri, function(err, result) {

    });
});
