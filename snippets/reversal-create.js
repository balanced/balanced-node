// credit_href is the stored href for the credit
balanced.get(credit_href).reversal({
    "amount": 3000, 
    "meta": {
        "merchant.feedback": "positive", 
        "user.refund_reason": "not happy with product", 
        "fulfillment.item.condition": "OK"
    }, 
    "description": "Reversal for Order #1111"
})