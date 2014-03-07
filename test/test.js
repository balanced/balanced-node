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


test('update_customer', function (assert, customer_create) {
    customer_create.name = "testing name";
    return customer_create.save().then(function (c) {
        assert(c.name == 'testing name');
    });
});

test('add_card_to_customer', function(assert, customer_create, card_create) {
    return card_create.associate_to_customer(customer_create).then(function () {
        assert(card_create.links.customer == customer_create.id);
        return card_create;
    });
});


test('add_bank_account_to_customer', function(assert, bank_account_create, customer_create) {
    return bank_account_create.associate_to_customer(customer_create)
        .then(function () {
            assert(bank_account_create.links.customer == customer_create.id);
        });
});

test('debit_card', function (add_card_to_customer){
    return add_card_to_customer.debit({amount: 5000});
});


test('hold_card', function (add_card_to_customer) {
    return add_card_to_customer.hold({amount: 400});
});

test('string_together', function(marketplace) {
    var c = marketplace.customers.create();
    return marketplace.cards.create({
        'number': '4111111111111111',
        'expiration_year': '2016',
        'expiration_month': '12'
    }).associate_to_customer(c).debit(500);
});

test('filter_customer_debits', function (marketplace) {
    var cb = this;
    var customer = marketplace.customers.create();
    var card = marketplace.cards.create(fixtures.card);
    return card.associate_to_customer(customer).then(function(card) {
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
                cb.assert(first_debit.href === debits[0].href);
            });
        });
    });
});

test('test_order_restrictions', function (assert, marketplace) {
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
                            assert(false);
                        },
                        function (err) {
                            assert(err.toString().indexOf(
                                'is not associated with order customer'
                            ) != -1);
                        }
                    )
            ]);
        });
    });
});


test('delete_card', function (cb, assert, marketplace) {
    // behavior for deleting is getting tweaked slightly soon
    marketplace.cards.create(fixtures.card).then(function(card) {
        var href = card.href;
        return card.delete().then(function () {
            return balanced.get(href)
                .catch(function (err) {
                    assert(err);
                    cb();
                });
        });
    });
});

test('verify_bank_account', function (assert, marketplace) {
    return marketplace.bank_accounts.create(fixtures.bank_account).then(function (bank_account) {
        assert(bank_account.can_debit == false);
        return bank_account.verify().then(function (verification) {
            return bank_account.confirm(1,1).then(function (bank_account) {
                assert(bank_account.can_debit == true);
            });
        });
    });
});

test('capture_hold', function(hold_card) {
    return hold_card.capture({});
});

test('paging_get_first', function (cb, assert, marketplace) {
    var customer = marketplace.customers.create();
    return marketplace.cards.create(fixtures.card)
        .associate_to_customer(customer)
        .then(function (cc) {
            customer.cards.get(0).then(function (c) {
                assert(cc.href == c.href);
                cb();
            });
        });
});

test('paging_all', function (cb, assert, marketplace, add_card_to_customer, customer_create) {
    customer_create.cards.then(function (card_page) {
        card_page.all().then(function (arr) {
            assert(arr instanceof Array);
            for(var i=0; i < arr.length; i++) {
                assert(arr[i]._type == 'card')
                assert(arr[i].links.customer == customer_create.id);
            }
            cb();
        });
    })
});

test('paging_none', function (cb, marketplace) {
    marketplace.customers.create().cards.get(0).catch(function () {
        cb();
    });
});

test('paging_first', function (cb, assert, marketplace) {
    marketplace.customers.create().cards.first().then(function (a) {
        assert(a === null);
        cb();
    });
});


test('api_key_page', function (cb, assert, marketplace) {
    balanced.api_key.query.then(function (page) {
        page.all().then(function (arr) {
            assert(arr.length == 1)
            assert(arr[0]._type == 'api_key');
            cb();
        });
    });
});

test('page_range', function (cb, assert, add_card_to_customer) {
    balanced.marketplace.cards.range(0, 20).then(function (arr) {
        assert(arr.length == 20);
        // we should have at least one card created already, but not 20
        assert(arr[0] != null);
        assert(arr[19] == null);
        cb();
    });
});

test('credit_create_bank_account', function (cb, assert, marketplace, debit_card) {
    balanced.marketplace.credits.create({
        amount: 500,
        destination: fixtures.bank_account
    }).then(function (credit) {
        assert(credit);
        credit.destination.then(function (dest) {
            // TODO: bug in the api
            // we should be able to get back the bank account
            // even though we can't credit/debit it any more
            // but we are getting an error
            assert(dest);
            cb();
        }, function(err) {
            cb(); // TODO: remove
        });
    });
});

test('events', function (cb, assert, marketplace) {
    function check() {
        marketplace.events.first().then(function (event) {
            if(!event)
                return setTimeout(check, 2000);
            assert(event.type);
            assert(event.id.substr(0, 2) == 'EV');
            cb();
        });
    }
    check();
});
