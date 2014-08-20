balanced.get( credit_href ).then(function( credit ) {
    credit.reversal({
        "amount": 8000,
        "description": "Reversal for Order #1111"
    })
})
