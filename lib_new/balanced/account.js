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
    add_underwriter: {
      path: ':marketplace_uri/accounts',
      method: 'post',
      requires: [
        'merchant'
      ]
    },
    list_underwriters: {
      path: ':marketplace_uri/accounts',
      method: 'get'
    },
    underwriter: {
      path: ':marketplace_uri/accounts/:account_id',
      method: 'get'
    },
    delete: {
      path: ':marketplace_uri/accounts/:account_id',
      method: 'delete'
    }
  }
}