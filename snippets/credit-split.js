// bank_account_href is the stored href for the bank account for Person A
balanced.get(bank_account_href_a).credit({
    "amount": 50000,
    "description": "Payout for order #1111"
})

// bank_account_href is the stored href for the bank account for Person B
balanced.get(bank_account_href_b).credit({
    "amount": 50000,
    "description": "Payout for order #1111"
})