var bank_account = balanced.marketplace.bank_accounts.create({
    "routing_number": "121000358",
    "account_type": "checking",
    "name": "Johann Bernoulli",
    "account_number": "9900000001"
}).then(function( bank_account ) {
    bank_account.associate_to_customer( merchant )
})

