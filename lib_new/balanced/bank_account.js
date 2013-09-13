module.exports = {
  name: 'bank_account',
  methods: {
    create: {
      path: 'bank_accounts',
      method: 'post',
      requires: [
        'routing_number',
        'name',
        'account_number',
        'type'
      ]
    },
    list: {
      path: 'bank_accounts',
      method: 'get',
      data: {
        limit: 10,
        offset: 0
      }
    },
    id: {
      path: 'bank_accounts/:bank_account_id',
      method: 'get'
    },
    delete: {
      path: 'bank_accounts/:bank_account_id',
      method: 'delete'
    }
  }
}