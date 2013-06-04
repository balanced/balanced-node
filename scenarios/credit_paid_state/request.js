{{api}}.Credits.create({
    bank_account: {
	name: "{{name}}",
	account_number: "{{account_number}}",
	routing_number: "{{routing_number}}"
	type: "Checking"
    },
    amount: "{{amount}}"
}, function(err, result) {
    LOG
});
