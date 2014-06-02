Balanced Node.js library
=========

[![Build Status](https://travis-ci.org/balanced/balanced-node.png?branch=master)](https://travis-ci.org/balanced/balanced-node)

The official Node.js library for [Balanced Payments](https://www.balancedpayments.com).

The Balanced Payments API located here: https://www.balancedpayments.com/docs/api.

**v1.x requires Balanced API 1.1.**

Installation
------------
The preferred way to install balanced for Node.js is to use the [npm](http://npmjs.org) package manager for Node.js. Simply type the following
into a terminal window:
```
npm install balanced-official
```

Basic Usage
-----------

```js
var balanced = require('balanced-official');

balanced.configure('api-secret-key');

var customer = balanced.marketplace.customers.create();

var card = balanced.marketplace.cards.create({
	'number': '4111111111111111',
	'expiration_year': '2016',
	'expiration_month': '12',
	 'cvv': '123'
});

card.associate_to_customer(customer)
	.debit(5000)
	.then(function (debit) {
		// save the result of the debit
	}, function (err) {
		// record the error message
	});;
```

[More examples](https://github.com/balanced/balanced-node/blob/rev1/test/test.js)


Testing
-------

To run the tests in a terminal run
```
npm test
```

To run a specific test, you can do
```
node test/test.js [test name]
```
