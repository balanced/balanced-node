// credit_href is the stored href for the Credit
// order_href is the stored href for the Order
balanced.get( credit_href ).reversal({
    "amount": 3000, 
    "meta": {
        "merchant.feedback": "positive", 
        "user.refund_reason": "not happy with product", 
        "fulfillment.item.condition": "OK"
    }, 
    "description": "Reversal for Order #1111",
    "order": order_href
})