var jsonapi = require('jsonapi-client');

var balanced = new jsonapi('https://api.balancedpayments.com', {
    'headers': {
        'Accept': 'application/vnd.balancedpayments+json; version=1.1, application/vnd.api+json',
        'User-Agent': 'balanced-node/1.0.0a'
    }
});

module.exports = balanced;

balanced.configure = function (api_key) {
    balanced.request_args.auth = {'user': api_key, 'pass': ''};
};


balanced._reg_type('api_key');
balanced._reg_type('marketplace', {
    // this underscore types represent items that are paged/or references
    // they are not required as we can deduce them from hypermedia
    // however by having them we can have them as assessors before
    // we have finished retrieving the item
    'debits': '_',
    'reversals': '_',
    'customers': '_',
    'credits': '_',
    'cards': '_',
    'card_holds': '_',
    'refunds': '_',
    'transactions': '_',
    'bank_accounts': '_',
    'callbacks': '_',
    'events': '_',
    'orders': '_'
});
var marketplace_href; // by keeping the href, the cache is manage by the jsonapi client
Object.defineProperty(balanced, 'marketplace', {
    'get': function () {
        return marketplace_href ? balanced.get(marketplace_href) : balanced.get('marketplaces').then(function (mp) {
            if(mp && mp.href) {
                marketplace_href = mp.href;
                return mp;
            }else{
                // we do not yet have a marketplace created
                // so we will create a test marketplace automatically
                return balanced.objects.marketplace.create().then(function (mp) {
                    marketplace_href = mp.href;
                    return mp;
                });
            }
        });
    }
});

function set_customer(obj) {
    return (typeof obj == 'string' ? balanced.get(obj) : balanced.Q(obj))
	.set('links.customer', this.id).save().thenResolve(this);
}

balanced._reg_type('customer', {
    add_card: set_customer,
    add_bank_account: set_customer,

    debits: '_',
    credits: '_',
    cards: '_',
    bank_accounts: '_',
    reversals: '_',
    refunds: '_',
    orders: '_',
    // are we removing source and destination from a customer?
    source: '_',
    destination: '_'
});

function transaction_create(type) {
    return function (args) {
	if(typeof args == 'number') args = {amount: args};
	return this.create(type, args);
    }
}

balanced._reg_type('card', {
    debit: transaction_create('debit'),
    hold: transaction_create('card_hold'),

    customer: '_',
    debits: '_',
    card_holds: '_'
});

balanced._reg_type('bank_account', {
    debit: transaction_create('debit'),
    credit: transaction_create('credit'),
    verify: transaction_create('bank_account_verification'),
    confirm: function (amount_1, amount_2) {
	return this.bank_account_verification.confirm(amount_1, amount_2);
    },

    bank_account_verifications: '_',
    credits: '_',
    debits: '_',
    customer: '_',
    bank_account_verification: '_',
});
balanced._reg_type('card_hold', {
    debit: transaction_create('debit'),

    card: '_',
});
balanced._reg_type('bank_account_verification', {
    confirm: function (amount_1, amount_2) {
	return this.set('amount_1', amount_1).set('amount_2', amount_2).save()
    },

    bank_account: '_',
});
balanced._reg_type('callback');
balanced._reg_type('chargeback');
balanced._reg_type('debit', {
    refund: transaction_create('refund'),

    customer: '_',
    refunds: '_',
    order: '_',
    source: '_',
    events: '_'
});
balanced._reg_type('credits', {
    reversal: transaction_create('reversal'),

    customer: '_',
    order: '_',
    destination: '_',
    events: '_'
});
balanced._reg_type('event');
balanced._reg_type('order', {
    debits: '_',
    refunds: '_',
    credits: '_',
    reversals: '_',
    buyers: '_',
    merchant: '_',
});
balanced._reg_type('refund', {
    debit: '_',
    order: '_',
    events: '_'
});
balanced._reg_type('reversal', {
    credit: '_',
    order: '_',
    events: '_'
});
