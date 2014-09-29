var marketplaceBankAccount = balanced.marketplace.owner_customer.bank_accounts.get( 0 ).then(function( marketplaceAccount ) {
    order.credit_to(marketplaceBankAccount, 2000)
})