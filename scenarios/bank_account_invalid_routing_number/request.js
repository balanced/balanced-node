{{api}}.BankAccounts.create({
      name: "{{name}}",
      account_number: "{{account_number}}",
      routing_number: "0000000000",
      type: "checking"
    }, function(err, result) {
	if(err) {
	    console.error(err);
	    throw err;
	}
	LOG
    });
