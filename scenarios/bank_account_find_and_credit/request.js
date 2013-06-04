{{api}}.BankAccounts.get("{{uri.bankAccount}}", function(err, result) {
    {{api}}.BankAccounts.credit(result.credits_uri, {{amount}}, "{{description}}", function(err, result) {

    });
});
