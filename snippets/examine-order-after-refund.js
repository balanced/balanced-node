order.refresh().then(function( order ) {
    console.log( order.amount );             // original order amount
    console.log( order.amount_escrowed );    // will decrease by amount of refunded credit
})