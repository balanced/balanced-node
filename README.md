nbalanced
=========

A node.js library for Balanced Payments. With the exception of event callback handling, provides a complete client library for interacting with the Balanced Payments API within node.js. You can find the Balanced Payments API documentation here: https://www.balancedpayments.com/docs/api.

Installation
------------
The preferred way to install nbalanced for Node.js is to use the [npm](http://npmjs.org) package manager for Node.js. Simply type the following
into a terminal window:
```
npm install nbalanced
```

Testing
-------

By running test/test.js you may test most of the functionality and use cases for nbalanced against the Balanced Payments API as well as see examples for invoking each of the methods exposed (jsDoc to come soon). In order to run the tests, you must edit the test.js file to include the marketplace_uri and secret values to the nbalanced module (just as if you were using it yourself). Here is where you would plug in your test account credentials supplied on your Balanced Payments Dashboard.

```js
var api = new nbalanced({
    marketplace_uri: "/v1/marketplaces/:marketplace-id", // test marketplace
    secret: ":secret" // test secret
});
```
    
As a word of *caution*, running through all of the tests will generate a lot of garbage in your test account, you have been forewarned.

Basic Usage
-----------

```js
var nbalanced = require('nbalanced');

var api = new nbalanced({
    marketplace_uri: "/v1/marketplaces/:marketplace-id",
    secret: ":secret"
});

// Create a credit card
// NOTE: Cards is a property of nbalanced() and already has API context.
api.Cards.create({
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
in the Balanced API and supercede the functionality previously provided by Accounts. Customers
were created to simplify merchant underwriting so that you can accept money on a vendors behalf.

Because of this, the nbalanced Customer prototype has an additional function called nbalanced, which takes an account object (containing the URI of the account, or from the Customers.(create | get | list) functions). This function returns a new nbalanced() instance with the customer as the context for all actions against it (e.g. a new bank account will be created for that customer automatically).

```js
// Customers are special, because accounts change API context so that bank account, cards, etc.
//  that are created for a specific account, are done so without the need for additional URI tracking
//  or contextual clues.

var newCustomerApi;
api.Customers.create({ name: "Valued Customer" }, function (err, newCustomer) {
    if (err) {
        console.error("api.Customer.create", err);
        throw err;
    }
    // Here we get an customer specific context of nbalanced() to work with. This is necessary for
    //  customer specific actions.
    newCustomerApi = api.Customer.nbalanced(newCustomer);
    console.log("Created new Customer:", newCustomer.uri);
});
```

Which now allows us to do:

```js
// add a bank account to the customer without having to specify the customer_uri
newCustomerApi.Customers.addBankAccount(tokenized_bank_account_uri, function(err, response){ ... })
```

Accounts (deprecated)
--------

Accounts are a special concept in the Balanced API. An account tracks a specific person or business whom may have many cards, bank accounts and transactions. The Balanced API also has specific and special use cases for dealing and interacting with accounts.

Because of this, the nbalanced Accounts prototype has an additional function called nbalanced, which takes an account object (containing the URI of the account, or from the Accounts.(create | get | list) functions). This function returns a new nbalanced() instance with the account as the context for all actions against it (e.g. a new bank account will be created for that account automatically).

```js
// Accounts are special, because accounts change API context so that bank account, cards, etc.
//  that are created for a specific account, are done so without the need for additional URI tracking
//  or contextual clues.
api.Accounts.create(function (err, object) {
    if (err) {
        console.error("api.Accounts.create", err);
        throw err;
    }
    var myAccount = object;
    // Here we get an account specific context of nbalanced() to work with. This is necessary for
    //  account specific actions.
    api = api.Accounts.nbalanced(myAccount);
    console.log("Created new Account:", myAccount.uri);
});
```

Or, we can also take a quick and dirty approach if all we have is the account URI:

```js
// Here we create an instance of nbalanced for our account annd create a bank account in one line.
api.Accounts.nbalannced({
  uri: "/v1/marketplaces/:marketplace-id/accounts/:account-id"
}).BankAccounts.create({/*...*/}, function (err, object){/*...*/});
```
