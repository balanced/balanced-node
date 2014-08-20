order.refresh().then(function( order ) {
    console.log( order.amount );             // original order amount
    console.log( order.amount_escrowed );    // will increase by amount of reversed credit
})