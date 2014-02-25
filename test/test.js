// These tests are designed to run concurrently
// this means that a test will run as soon as everything
// that it depends on has finished.
// to run a single test do: node test.js [name of test to run]



var test = require('./simple_tests')

balanced = require('../');

var fixtures = {
    card: {
        'number': '4111111111111111',
        'expiration_year': '2016',
        'expiration_month': '12'
    },
    bank_account: {
        name: "Miranda Benz",
        account_number: "9900826301",
        routing_number: "021000021",
        type: "checking",
        meta: {
            info: "created another test account",
            test: true
        }
    }
};


test('api_key', function () {
    return balanced.api_key.create().then(function(obj) {
        balanced.configure(obj.secret);
        return obj;
    });
});

test('marketplace', function (api_key) {
    return balanced.marketplace;
});

test('customer_create', function(marketplace) {
    return marketplace.customers.create();
});

test('card_create', function (marketplace){
    return balanced.marketplace.cards.create({
        'number': '4111111111111111',
        'expiration_year': '2016',
        'expiration_month': '12'
    });
});


test('bank_account_create', function (marketplace) {
    return marketplace.bank_accounts.create({
        'routing_number': '021000021',
        'account_number': '9900000002',
        'name': 'what up',
        'type': 'checking'
    });
});


test('update_customer', function (customer_create) {
    var cb = this;
    customer_create.name = "testing name";
    return customer_create.save().then(function (c) {
        cb.assert(c.name == 'testing name');
    });
});

test('add_card_to_customer', function(customer_create, card_create) {
    var cb = this;
    return card_create.associate_to_customer(customer_create).then(function () {
        cb.assert(card_create.links.customer == customer_create.id);
        return card_create;
    });
});


test('add_bank_account_to_customer', function(bank_account_create, customer_create) {
    var cb = this;
    return customer_create.add_bank_account(bank_account_create)
        .then(function () {
            cb.assert(bank_account_create.links.customer == customer_create.id);
        });
});

test('debit_card', function (add_card_to_customer){
    var cb = this;
    return add_card_to_customer.debit({amount: 500});
});


test('hold_card', function (add_card_to_customer) {
    var cb = this;
    return add_card_to_customer.hold({amount: 400});
});

test('string_together', function(marketplace) {
    return marketplace.customers.create().add_card(
        marketplace.cards.create({
            'number': '4111111111111111',
            'expiration_year': '2016',
            'expiration_month': '12'
        })
    ).cards.get(0).debit(500);
});

test('filter_customer_debits', function (marketplace) {
    var cb = this;
    var customer = marketplace.customers.create();
    var card = marketplace.cards.create(fixtures.card);
    return customer.add_card(card).then(function(customer) {
	return balanced.Q.all([
	    card.debit({
		amount: 1234,
		meta: {
		    testing: 'first debit'
		}
	    }),
	    card.debit({
		amount: 5678,
		meta: {
		    testing: 'second debit',
		}
	    })
	]).then(function (debits) {
	    return customer.debits.filter('meta.testing', 'first debit').get(0).then(function (first_debit) {
		cb.assert(first_debit === debits[0]);
	    });
	});
    });
});

test('test_order_restrictions', function (marketplace) {
    var cb = this;
    var merchant = marketplace.customers.create();
    var merchant_other = marketplace.customers.create();
    var buyer = marketplace.customers.create();
    var order = merchant.orders.create();
    return balanced.Q.all([
	marketplace.bank_accounts.create(fixtures.bank_account)
	.associate_to_customer(merchant),
	marketplace.bank_accounts.create(fixtures.bank_account)
	.associate_to_customer(merchant_other),
	marketplace.cards.create(fixtures.card)
	.associate_to_customer(buyer),
	order
    ]).spread(function (merchant_ba, other_ba, card, order) {
	return order.debit_from(card, 5000).then(function (debit) {
	    return balanced.Q.all([
		merchant_ba.credit({amount: 2500, order: order.href}),
		other_ba.credit({amount: 2000, order: order.href})
		    .then(
			function () {
			    cb.assert(false);
			},
			function (err) {
			    cb.assert(err.toString().indexOf(
				'is not associated with order customer'
			    ) != -1);
			}
		    )
	    ]);
	});
    });
});


test('delete_card', function (marketplace) {
    // behavior for deleting is getting tweaked slightly soon
    var cb = this;
    marketplace.cards.create(fixtures.card).then(function(card) {
	var href = card.href;
	return card.delete().then(function () {
	    return balanced.get(href)
		.catch(function (err) {
		    cb.assert(err);
		    cb();
		});
	});
    });
});

test('verify_bank_account', function (marketplace) {
    var cb = this;
    return marketplace.bank_accounts.create(fixtures.bank_account).then(function (bank_account) {
	cb.assert(bank_account.can_debit == false);
	return bank_account.verify().then(function (verification) {
	    return bank_account.confirm(1,1).then(function (bank_account) {
		cb.assert(bank_account.can_debit == true);
	    });
	});
    });
});

test('capture_hold', function(hold_card) {
    return hold_card.capture({});
});
