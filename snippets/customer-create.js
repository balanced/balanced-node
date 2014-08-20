var merchant = balanced.marketplace.customers.create({
    "address": {
        "postal_code": "48120"
    },
    "name": "Henry Ford",
    "dob_year": 1963,
    "dob_month": 7
})

balanced.marketplace.bank_accounts.create({
    "routing_number": "121000358",
    "account_type": "checking",
    "name": "Johann Bernoulli",
    "account_number": "9900000001"
}).then(function( bank_account ) {
    bank_account.associate_to_customer( merchant )
})