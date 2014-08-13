// bank_account_href is the stored href for the bank account
balanced.get(bank_account_href).credit({
    "amount": 100000,
    "description": "Payout for order #1111",
    "appears_on_statement_as": "GoodCo #1111"
})