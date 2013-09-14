module.exports = {
  name: 'account',
  methods: {
    create: {
      path: ':marketplace_uri/accounts',
      method: 'post'
    },
    list: {
      path: ':marketplace_uri/accounts',
      method: 'get'
    },
    id: {
      path: ':marketplace_uri/accounts/:account_id',
      method: 'get'
    },
    add_card: {
      path: ':marketplace_uri/accounts/:account_id',
      method: 'put',
      requires: [
        'card_uri'
      ]
    },
    add_bank: {
      path: ':marketplace_uri/accounts/:account_id',
      method: 'put',
      requires: [
        'bank_account_uri'
      ]
    },
    underwrite_person: {
      path: ':marketplace_uri/accounts',
      method: 'post',
      requires: [
        'merchant'
      ]
    },
    underwrite_business: {
      path: ':marketplace_uri/accounts',
      method: 'post',
      requires: [
        'merchant'
      ]
    },
    delete: {
      path: ':marketplace_uri/accounts/:account_id',
      method: 'delete'
    }
  }
}