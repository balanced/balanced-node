// refresh the order to get recent changes
order.refresh().then(function( order ) {
    console.log( order.amount );
    console.log( order.amount_escrowed );
})