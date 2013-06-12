{{api}}.Cards.create({
    card_number: "{{card}}",
    expiration_year: {{year}},
    expiration_month: {{month}},
    security_code: "{{security_code}}"
}, function(err, result) {
    LOG
});
