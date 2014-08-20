var buyer = balanced.marketplace.customers.create({
    "address": {
        "postal_code": "48120"
    },
    "name": "Henry Ford",
    "dob_year": 1963,
    "dob_month": 7
})

var card = balanced.marketplace.cards.create({
    "expiration_month": "12",
    "cvv": "123",
    "number": "5105105105105100",
    "expiration_year": "2020"
}).then(function( card ) {
    card.associate_to_customer( buyer )
})