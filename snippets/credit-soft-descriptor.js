// bank_account_href is the stored href for the BankAccount
// order_href is the stored href for the Order
balanced.get( bank_account_href ).credit({
    "amount": 100000,
    "description": "Payout for order #1111",
    "appears_on_statement_as": "GoodCo #1111",
    "order": order_href
})