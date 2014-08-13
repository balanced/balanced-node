// bank_account_href is the stored href for the bank account
balanced.get(bank_account_href).debit({
    "appears_on_statement_as": "Statement text", 
    "amount": 5000, 
    "description": "Some descriptive text for the debit in the dashboard"
})