{{api}}.Credits.create({
    amount: {{amount}},
    bank_account: {
	name: "{{name}}",
	account_number: "{{account_number}}",
	routing_number: "{{routing_number}}",
	type: "checking"
    }
}, function(err, result) {
    LOG
});
