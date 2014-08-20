order.debits.get( 0 ).then(function( debit ) {
    debit.refund({
        "amount": 10000,
        "description": "Refund for Order #1111"
    })
})
