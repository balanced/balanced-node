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
    card_dispute_txn: {
        'number': '6500000000000002',
        'expiration_year': '3000',
        'expiration_month': '12',
        'cvv': '123'
    },
    card_creditable: {
        'name': 'Johannes Bach',
        'number': '4342561111111118',
        'expiration_month': '05',
        'expiration_year': '2016'
    },
    card_creditable_no_name: {
        'number': '4342561111111118',
        'expiration_month': '05',
        'expiration_year': '2016'
    },
    card_non_creditable: {
        'name': 'Georg Telemann',
        'number': '4111111111111111',
        'expiration_month': '12',
        'expiration_year': '2016'
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
        console.log('Configure with api key: ', obj.secret);
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
        return c;
    });
});

test('update_customer_chain', function (assert, update_customer) {
    return balanced.get(update_customer.href).set('email', 'test@example.com').save()
        .then(function (res) {
            assert(res.email == 'test@example.com');
            return res;
        }, function (err) {
            assert(false);
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

test('debit_card', function (add_card_to_customer) {
    return add_card_to_customer.debit({amount: 500000});
});

test('hold_card', function (add_card_to_customer) {
    return add_card_to_customer.hold({amount: 400});
});

test('dispute', function (cb, assert, marketplace) {
    var timeout = 12 * 60 * 1000;
    var interval = 30 * 1000;
    var begin = new Date();

    var customer = marketplace.customers.create();
    var card = marketplace.cards.create(fixtures.card_dispute_txn).associate_to_customer(customer);
    var debit = card.debit({amount: 5000});
    debit.then(function(d) {
        console.log('Looking for dispute on: ', d.id);
        function poll_dispute() {
            balanced.get(d.href).dispute.then(function (dispute) {
                if (!dispute.href) {
                    console.log("polling for dispute...");
                    var now = new Date();
                    assert(((now.getTime() - begin.getTime()) < timeout));
                    if ((now.getTime() - begin.getTime()) < timeout) {
                        return setTimeout(poll_dispute, interval);
                    }
                    else {
                        cb();
                    }
                }
                assert(dispute.status == "pending");
                assert(dispute.reason == "fraud");
                assert(dispute.amount == d.amount);
                cb();
            });
        }
        poll_dispute();
    });
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
    marketplace.cards.create(fixtures.card).then(function(card) {
        var href = card.href;
        return card.unstore().then(function () {
            return balanced.get(href).then(function (c) {
                // when you directly get at the href for a deleted item
                // it will still return the info for that item
                // but the card will no longer show up in any indexes
                assert(c);
                cb();
            });
        });
    });
});

test('delete_bank_account', function (cb, assert, marketplace) {
    marketplace.bank_accounts.create(fixtures.bank_account).then(function(bank_account) {
        var href = bank_account.href;
        return bank_account.unstore().then(function () {
            return balanced.get(href).then(function (ba) {
                // when you directly get at the href for a deleted item
                // it will still return the info for that item
                // but the card will no longer show up in any indexes
                assert(ba);
                cb();
            });
        });
    });
});

test('debit_untokenized_card', function (cb, assert, marketplace) {
    marketplace.debits.create({
        source: fixtures.card,
        amount: 1000
    }).then(function (debit) {
        assert(debit.amount == 1000);
        cb();
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

test('credit_card', function (cb, assert, marketplace, debit_card) {
    balanced.marketplace.credits.create({
        amount: 250000,
        destination: fixtures.card_creditable
    }).then(function (credit) {
        assert(credit);
        assert(credit.amount == 250000);
        assert(credit.status == 'succeeded');
        credit.destination.then(function (dest) {
            assert(dest);
            cb();
        }, function(err) {
            cb(); // TODO: remove
        });
    });
});

test('credit_card_can_credit_false', function(cb, assert, marketplace) {
    balanced.marketplace.cards.create({
        'number': '4111111111111111',
        'expiration_month': '05',
        'expiration_year': '2016'
    }).then(function (card) {
        card.credit({
            "amount": 1000,
            "description": "Credit"
    }).then(function (customer) {
        assert(false);
    }, function (err) {
        assert(err.message == 'FundingInstrumentNotCreditable');
        cb();
        });
    });
});

test('credit_card_limit', function (cb, assert, marketplace, debit_card) {
    balanced.marketplace.credits.create({
        amount: 250001,
        destination: fixtures.card_creditable
    }).then(function (credit) {
    }, function(err) {
        var error = JSON.parse(err.message).errors[0];
        assert(error.status_code == 409);
        assert(error.category_code == 'amount-exceeds-limit');
        cb();
    });
});

test('credit_card_require_name', function (cb, assert, marketplace, debit_card) {
    balanced.marketplace.credits.create({
        amount: 250001,
        destination: fixtures.card_creditable_no_name
    }).then(function (credit) {
    }, function(err) {
        var error = JSON.parse(err.message).errors[0];
        assert(error.status_code == 400);
        assert(error.category_code == 'request');
        cb();
    });
});

test('events', function (cb, assert, marketplace) {
    var timeout = 1 * 60 * 1000;
    var interval = 5 * 1000;
    var begin = new Date();

    function check() {
        marketplace.events.first().then(function (event) {
            console.log("polling for events...");
            var now = new Date();
            assert(((now.getTime() - begin.getTime()) < timeout));
            if (!event && ((now.getTime() - begin.getTime()) < timeout)) {
                return setTimeout(check, interval);
            }
            else {
                cb();
            }

            assert(event.type);
            assert(event.id.substr(0, 2) == 'EV');
            cb();
        });
    }
    check();
});

test('get_owner_customer_bank_account', function (marketplace) {
    return balanced.marketplace.owner_customer.bank_accounts.get(0);
});

test('get_owner_customer_bank_account2', function (marketplace) {
    return balanced.marketplace.owner_customer.bank_accounts.first();
});

test('credit_owner_bank_account', function(cb, assert, debit_card) {
    balanced.marketplace.owner_customer.bank_accounts.get(0).credits.create({
        amount: 100
    }).then(function (credit) {
        assert(credit);
        balanced.marketplace.owner_customer.then(function (c) {
            assert(c.id == credit.links.customer);
            cb();
        });
    }, function(err) {
        assert(false)
    });
});

test('access_error', function (cb, assert, marketplace) {
    marketplace.cards.create({
        number: '4111111111111112',
        expiration_year: '2016',
        expiration_month: '12'
    }).then(function (c) {
        assert(false);
    }, function(err) {
        assert(err.category_code == "card-not-validated");
        assert(err instanceof Error);
        assert(err instanceof balanced.ERROR);
        cb(err);
    });
});

test('card_address', function (marketplace, assert) {
    return marketplace.cards.create({
        cvv: '123',
        expiration_month: '12',
        expiration_year: '2020',
        number: '5105105105105100',
        address: {
            city: "BROOKLYN",
            line1: "219 17TH STREET",
            postal_code: "11215",
            country_code: "USA"
        }
    }).then(function (card) {
        assert(card.address.state != 'CA');
        debugger;
    });
});

test('chain_filters', function(marketplace, assert) {
    return marketplace.cards.filter('test', '123').filter('another', '456').then(function(p) {
        assert(p._url.indexOf('123') != -1);
        assert(p._url.indexOf('456') != -1);
    });
});


// TODO: need a way to run tests in serial that can change the interals of the system
test('evict', function (cb, assert, page_range, verify_bank_account, dispute, events) {
    var s = Object.keys(balanced.cache);
    balanced.cache_time_limit = 2000;
    balanced._manage_cache();
    assert(Object.keys(balanced.cache).length < s.length);
    balanced.cache_time_limit = 60000;
    cb();
});
