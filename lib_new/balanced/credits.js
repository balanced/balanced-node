module.exports = {
  name: 'credits',
  methods: {
    create: {
      path: 'bank_accounts/:bank_account_id/credits',
      method: 'post',
      requires: [
        'amount'
      ]
    },
    id: {
      path: 'credits/:credit_id',
      method: 'get'
    },
    list: {
      path: 'credits',
      method: 'get'
    }
  }
}