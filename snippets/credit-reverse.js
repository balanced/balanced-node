order.credits.get( 0 ).then(function( credit ) {
    credit.reversal({
        "amount": 8000,
        "description": "Reversal for Order #1111"
    })
})
