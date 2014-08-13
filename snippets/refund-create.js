// debit_href is the stored href for the credit
balanced.get(debit_href).refund({
    "amount": 3000, 
    "meta": {
        "merchant.feedback": "positive", 
        "user.refund_reason": "not happy with product", 
        "fulfillment.item.condition": "OK"
    }, 
    "description": "Refund for Order #1111"
})