{{api}}.BankAccounts.create({
      name: "{{name}}",
      account_number: "{{account_number}}",
      routing_number: "0000000000",
      type: "checking"
    }, function(err, result) {
	if(err) {
	    console.log(err.description);
	    throw err;
	}

    });
