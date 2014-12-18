var jsonapi = require('jsonapi-client');

var balanced = new jsonapi(process.env.BALANCED_ROOT || 'https://api.balancedpayments.com', {
    'headers': {
        'Accept': 'application/vnd.balancedpayments+json; version=1.1, application/vnd.api+json',
        'User-Agent': 'balanced-node/' + require('../package.json').version,
    }
});

module.exports = balanced;

balanced.configure = function (api_key) {
    balanced.request_args.auth = {'user': api_key, 'pass': ''};
};


balanced.registerType('api_key');
balanced.registerType('marketplace', {
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
    'orders': '_',
    'accounts': '_',
    'settlements': '_'
});
var marketplace_href; // by keeping the href, the cache is managed by the jsonapi client
Object.defineProperty(balanced, 'marketplace', {
    'get': function () {
        return marketplace_href ? balanced.get(marketplace_href) : balanced.get('marketplaces').then(function (mp) {
            if (mp && mp.href) {
                marketplace_href = mp.href;
                return mp;
            } else {
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


balanced.registerType('customer', {
        payable_account: function () {
        return this.accounts.filter('account_type', 'payable').get(0)
    },

    accounts: '_',
    debits: '_',
    credits: '_',
    cards: '_',
    bank_accounts: '_',
    reversals: '_',
    refunds: '_',
    orders: '_'
});

function transaction_create(type) {
    return function (args) {
        if (typeof args == 'number') args = {amount: args};
        return this.create(type, args);
    }
}

function associate_to_customer(customer) {
    return this.set('links.customer', typeof customer === 'string' ? customer : customer.href).save();
}

balanced.registerType('card', {
    debit: transaction_create('debit'),
    credit: transaction_create('credit'),
    hold: transaction_create('card_hold'),
    associate_to_customer: associate_to_customer,

    customer: '_',
    debits: '_',
    credits: '_',
    card_holds: '_'
});

balanced.registerType('bank_account', {
    debit: transaction_create('debit'),
    credit: transaction_create('credit'),
    associate_to_customer: associate_to_customer,
    verify: transaction_create('bank_account_verification'),
    confirm: function (amount_1, amount_2) {
        return this.bank_account_verifications.get(0)
            .confirm(amount_1, amount_2)
            .thenResolve(this).refresh();
    },

    bank_account_verifications: '_',
    credits: '_',
    debits: '_',
    customer: '_',
    bank_account_verification: '_',
});

balanced.registerType('card_hold', {
    // .debit on a card_hold references the debit that
    // was created using this hold, so we can not have
    // .debit() method, and instead use .capture()
    capture: transaction_create('debit'),
    void: function () {
        return this.unstore()
    },

    card: '_',
});

balanced.registerType('bank_account_verification', {
    confirm: function (amount_1, amount_2) {
        this.amount_1 = amount_1;
        this.amount_2 = amount_2;
        return this.save();
    },

    bank_account: '_',
});

balanced.registerType('callback');

balanced.registerType('debit', {
    refund: transaction_create('refund'),

    customer: '_',
    refunds: '_',
    order: '_',
    source: '_',
    events: '_',
    dispute: '_'
});

balanced.registerType('credit', {
    reversal: transaction_create('reversal'),

    customer: '_',
    reversals: '_',
    order: '_',
    destination: '_',
    events: '_'
});

balanced.registerType('event');

balanced.registerType('order', {
    debit_from: function (source, args) {
        if(typeof args == 'number')
            args = {amount: args};
        args.order = this.href;
        return source.debit(args);
    },
    credit_to: function (destination, args) {
        if(typeof args == 'number')
            args = {amount: args};
        args.order = this.href;
        return destination.credit(args);
    },

    debits: '_',
    refunds: '_',
    credits: '_',
    reversals: '_',
    buyers: '_',
    merchant: '_',
});

balanced.registerType('refund', {
    debit: '_',
    order: '_',
    events: '_',
    dispute: '_'
});

balanced.registerType('reversal', {
    credit: '_',
    order: '_',
    events: '_'
});

balanced.registerType('dispute', {
    events: '_',
    transaction: '_'
});
balanced.registerType('account', {
    credit: transaction_create('credit'),
    settle: transaction_create('settlement'),

    customer: '_',
    credits: '_',
    debits: '_',
    settlements: '_'
});

balanced.registerType('settlement', {
    destination: '_',
    source: '_'
});