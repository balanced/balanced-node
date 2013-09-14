Balanced Node.js library
=========

[![Build Status](https://travis-ci.org/balanced/balanced-node.png?branch=master)](https://travis-ci.org/balanced/balanced-node)

The official Node.js library for [Balanced Payments](https://www.balancedpayments.com).  Originally written by [Tenor Enterprises](http://tenorent.com/).

The Balanced Payments API located here: https://www.balancedpayments.com/docs/api.

Installation
------------
The preferred way to install balanced for Node.js is to use the [npm](http://npmjs.org) package manager for Node.js. Simply type the following
into a terminal window:
```
npm install balanced-official
```

Testing
-------
Set up your definitions:
`cp tests/definitions.sample.js tests/definitions.js`

Edit the new definitions.js to contain your API `secret`, `api_verion`, and `marketplace_uri` (although marketplace_uri) is not used yet.

Run the tests:
`node tests/run`

Make your own tests with simple JSON. Place them in `tests/run/*.js`

Basic Usage
-----------

```js
var balanced = require('balanced');

balanced.init("API_SECRET", "MARKETPLACE_URI");

// Create a credit card
balanced.card.create({
    card_number: "5105105105105100",
    expiration_year: 2020,
    expiration_month: 12,
    security_code: "123"
}, function (err, object) {
    if (err) {
        console.error("api.Cards.create", err);
        throw err;
    }
    myCard = object;
    console.log("Created new Card:", myCard.uri);
    next("api.Cards.create");
});
```

Customers
---------

`Customers` are the best way to manage an entity's bank accounts, cards and transactions
in the Balanced API and supersede the functionality previously provided by Accounts. Customers
were created to simplify merchant underwriting so that you can accept money on a vendors behalf.

```js
balanced.customer.create({ name: "Valued Customer" }, function (err, newCustomer) {
    if (err) {
        console.error("customer.create", err);
        throw err;
    }
});
```

Which now allows us to do:

```js
balanced.customer.add_bank({bank_account_uri: <bank_account_uri>}, {customer_id: newCustomer.customer_uri},  function(err, response){ ... })
```
