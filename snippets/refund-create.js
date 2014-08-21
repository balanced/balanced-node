// debit_href is the stored href for the Debit
// order_href is the stored href for the Order
balanced.get( debit_href ).refund({
    "amount": 3000, 
    "meta": {
        "merchant.feedback": "positive", 
        "user.refund_reason": "not happy with product", 
        "fulfillment.item.condition": "OK"
    }, 
    "description": "Refund for Order #1111",
    "order": order_href
})